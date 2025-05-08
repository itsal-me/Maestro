from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import redirect
from django.conf import settings
from .services import SpotifyService, AIService
from django.contrib.auth.models import User
from .models import UserProfile, UserAnalysis, GeneratedPlaylist
from .serializers import UserAnalysisSerializer, GeneratedPlaylistSerializer
import datetime
import json

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
            tokens = SpotifyService.get_tokens(code)

            # Get user data from Spotify
            sp_data = SpotifyService.get_user_data(tokens['access_token'])
            spotify_user = sp_data['user']
            spotify_id = spotify_user['id']

            # Try to find existing user profile
            try:
                user_profile = UserProfile.objects.get(spotify_id=spotify_id)
                user = user_profile.user
                created = False
            except UserProfile.DoesNotExist:
                # Create Django user
                user = User.objects.create(
                    username=spotify_user.get('display_name', spotify_id)
                )

                # Create UserProfile
                user_profile = UserProfile.objects.create(
                    user=user,
                    spotify_id=spotify_id
                )
                created = True

            # Update tokens in UserProfile
            user_profile.access_token = tokens['access_token']
            user_profile.refresh_token = tokens['refresh_token']
            user_profile.token_expires = datetime.datetime.now() + datetime.timedelta(seconds=tokens['expires_in'])
            user_profile.save()

            return Response({
                'user_id': user_profile.id,
                'spotify_id': user_profile.spotify_id,
                'access_token': user_profile.access_token
            })

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class AnalyzeUserView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'User ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserProfile.objects.get(id=user_id)
            sp_data = SpotifyService.get_user_data(user.access_token)

            # Get AI analysis
            ai_response = AIService.analyze_music_data(sp_data)
            analysis_data = json.loads(ai_response)

            # Save analysis to database
            analysis = UserAnalysis.objects.create(
                user=user,
                personality_type=analysis_data.get('personality_type', ''),
                music_analytics=analysis_data.get('analytics', {}),
            )

            serializer = UserAnalysisSerializer(analysis)
            return Response(serializer.data)

        except UserProfile.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GeneratePlaylistView(APIView):
    def post(self, request):
        user_id = request.data.get('user_id')
        mood = request.data.get('mood')
        prompt = request.data.get('prompt')

        if not user_id:
            return Response({'error': 'User ID not provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = UserProfile.objects.get(id=user_id)
            sp_data = SpotifyService.get_user_data(user.access_token)

            # Get playlist from AI
            ai_response = AIService.generate_playlist(sp_data, mood, prompt)
            playlist_data = json.loads(ai_response)

            # Create playlist on Spotify
            playlist = SpotifyService.create_playlist(
                user.spotify_id,
                user.access_token,
                playlist_data['name'],
                playlist_data['description'],
                playlist_data['tracks']
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
