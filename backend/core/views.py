from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from django.conf import settings
from .services import SpotifyService, AIService
from django.contrib.auth.models import User
from .models import UserProfile, UserAnalysis, GeneratedPlaylist
from .serializers import UserAnalysisSerializer, GeneratedPlaylistSerializer
from datetime import timedelta
from django.utils import timezone
import json
from django.http import JsonResponse as JSONRESPONSE
from .utils import parse_and_normalize_ai_json

class SpotifyAuthView(APIView):
    def get(self, request):
        auth_url = SpotifyService.get_auth_url()
        return Response({'auth_url': auth_url})
    
class SpotifyCallbackView(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if not code:
            return Response({'error': 'Authorization code not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Step 1: Exchange code for tokens
            tokens = SpotifyService.get_tokens(code)
            
            if not tokens or 'access_token' not in tokens:
                return Response({'error': 'Failed to retrieve tokens from Spotify'}, status=status.HTTP_400_BAD_REQUEST)

            access_token = tokens['access_token']
            refresh_token = tokens.get('refresh_token')
            token_expires = timezone.now() + timedelta(seconds=tokens.get('expires_in', 3600))  # fallback to 1h

            # Step 2: Fetch Spotify user info
            sp_data = SpotifyService.get_user_data(access_token=access_token)
            spotify_user = sp_data['user']
            spotify_id = spotify_user['id']
            display_name = spotify_user.get('display_name', '')

            user, _ = User.objects.get_or_create(
                username=spotify_id,
                defaults={'first_name': display_name}
            )

            # Step 3: Get or create User + UserProfile
            user_profile, created = UserProfile.objects.get_or_create(
                spotify_id=spotify_id,
                defaults={
                    'user': user,
                    'access_token': access_token,
                    'refresh_token': refresh_token,
                    'token_expires': token_expires,
                }
            )

            if not created:
                user_profile.access_token = access_token
                if refresh_token:
                    user_profile.refresh_token = refresh_token
                user_profile.token_expires = token_expires
                user_profile.save()

                if user_profile.user.first_name != display_name:
                    user_profile.user.first_name = display_name
                    user_profile.user.save()

            
            return Response({
                'user_id': user_profile.id,
                'spotify_id': user_profile.spotify_id,
                'access_token': user_profile.access_token,
                'token_expires': user_profile.token_expires.isoformat(),
            })

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class RefreshTokenView(APIView):
    def post(self, request):
        refresh_token = request.data.get('refresh_token')
        if not refresh_token:
            return Response({'error': 'Refresh token not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Refresh the access token using the refresh token
            tokens = SpotifyService.refresh_access_token(refresh_token)

            # Update the user profile with the new access token and refresh token (if applicable)
            user_profile = UserProfile.objects.get(refresh_token=refresh_token)
            user_profile.access_token = tokens['access_token']
            if 'refresh_token' in tokens:
                user_profile.refresh_token = tokens['refresh_token']
            user_profile.token_expires = timezone.now() + timedelta(seconds=tokens['expires_in'])
            user_profile.save()

            return Response({
                'access_token': user_profile.access_token,
            })

        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    def get(self, request, user_id):
        try:
            #return spotify user data from spotifyservice.get_user_data
            user_profile = UserProfile.objects.get(id=user_id)
            sp_data = SpotifyService.get_user_data(user_profile=user_profile)
            user_data = {
                'spotify_id': user_profile.spotify_id,
                'display_name': sp_data['user'].get('display_name', ''),
                'email': sp_data['user'].get('email', ''),
                'followers': sp_data['user'].get('followers', {}).get('total', 0),
                'images': sp_data['user'].get('images', []),
                'country': sp_data['user'].get('country', ''),
                'top_tracks': sp_data['top_tracks'],
                'top_artists': sp_data['top_artists'],
                'recently_played': sp_data['recently_played'],
                'saved_tracks': sp_data['saved_tracks']
            }

            return Response(user_data)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class AnalyzeUserView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'User ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Get user profile
            user = UserProfile.objects.get(id=user_id)

            # Collect Spotify data for the user
            spotify_data = SpotifyService.get_user_data(user_profile=user)

            # Get and normalize AI response
            ai_response = AIService.analyze_music_data(spotify_data)
            parsed_data = parse_and_normalize_ai_json(ai_response)

            print("parsed data:", parsed_data)

            generated_analyis = UserAnalysis.objects.create(
                user=user,
                personality_type = parsed_data['personality_type'],
                description = parsed_data['description'],
                music_analytics = parsed_data['analytics'],
                insights = parsed_data['insights'],
                recommendations = parsed_data['recommendations']
            )

            # Prepare serializer and validate
            serializer = UserAnalysisSerializer(generated_analyis)
            return Response(serializer.data)

        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        except ValueError as ve:
            return Response({'error': f'Parsing error: {ve}'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': f'Unexpected server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class GeneratePlaylistView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        mood = request.data.get('mood')
        prompt = request.data.get('prompt')

        if not user_id:
            return Response({'error': 'User ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        if not mood and not prompt:
            return Response({'error': 'Either mood or prompt must be provided.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserProfile.objects.get(id=user_id)
            sp_data = SpotifyService.get_user_data(userprofile=user)

            # Get playlist from AI
            ai_response = AIService.generate_playlist(sp_data, mood, prompt)
            playlist_data = json.loads(ai_response)

            # Create playlist on Spotify
            playlist = SpotifyService.create_playlist(
                user.spotify_id,
                playlist_data['name'],
                playlist_data['description'],
                playlist_data['tracks'],
                user_profile=user
            )

            # Save to database
            generated_playlist = GeneratedPlaylist.objects.create(
                user=user,
                playlist_id=playlist['id'],
                name=playlist['name'],
                description=playlist['description'],
                mood=mood,
                prompt=prompt
            )

            serializer = GeneratedPlaylistSerializer(generated_playlist)
            return Response(serializer.data)

        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserAnalysesView(APIView):
    def get(self, request, user_id):
        try:
            analyses = UserAnalysis.objects.filter(user_id=user_id).order_by('-generated_at')
            serializer = UserAnalysisSerializer(analyses, many=True)

            return Response(serializer.data)
        

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class UserPlaylistsView(APIView):
    def get(self, request, user_id):
        try:
            playlists = GeneratedPlaylist.objects.filter(user_id=user_id).order_by('-generated_at')
            serializer = GeneratedPlaylistSerializer(playlists, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
