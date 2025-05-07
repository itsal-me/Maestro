import requests
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from datetime import datetime, timedelta
import json
from django.conf import settings
from .utils import format_spotify_data_for_ai

class SpotifyService:
    @staticmethod
    def get_auth_url():
        auth_manager = SpotifyOAuth(
            client_id=settings.SPOTIFY_CLIENT_ID,
            client_secret=settings.SPOTIFY_CLIENT_SECRET,
            redirect_uri=settings.SPOTIFY_REDIRECT_URI,
            scope='user-library-read user-top-read playlist-modify-public playlist-modify-private'
        )
        return auth_manager.get_authorize_url()

    @staticmethod
    def get_tokens(code):
        auth_manager = SpotifyOAuth(
            client_id=settings.SPOTIFY_CLIENT_ID,
            client_secret=settings.SPOTIFY_CLIENT_SECRET,
            redirect_uri=settings.SPOTIFY_REDIRECT_URI
        )
        tokens = auth_manager.get_access_token(code)
        return tokens

    @staticmethod
    def get_user_data(access_token):
        sp = spotipy.Spotify(auth=access_token)
        user = sp.current_user()
        
        # Get top tracks
        top_tracks = sp.current_user_top_tracks(limit=50, time_range='medium_term')
        
        # Get top artists
        top_artists = sp.current_user_top_artists(limit=50, time_range='medium_term')
        
        # Get recently played
        recently_played = sp.current_user_recently_played(limit=50)
        
        # Get saved tracks
        saved_tracks = sp.current_user_saved_tracks(limit=50)
        
        return {
            'user': user,
            'top_tracks': top_tracks,
            'top_artists': top_artists,
            'recently_played': recently_played,
            'saved_tracks': saved_tracks
        }

    @staticmethod
    def create_playlist(user_id, access_token, name, description, tracks):
        sp = spotipy.Spotify(auth=access_token)
        playlist = sp.user_playlist_create(
            user=user_id,
            name=name,
            public=True,
            description=description
        )
        
        sp.playlist_add_items(playlist['id'], tracks)
        return playlist


class AIService:
    @staticmethod
    def analyze_music_data(data):
        formatted_data = format_spotify_data_for_ai(data)
        
        prompt = f"""
You are a music psychologist analyzing a user's Spotify data to provide insights about their personality and music preferences.

### Instructions:
1. Analyze the provided music data thoroughly
2. Respond with ONLY valid JSON format
3. If a field cannot be determined, use null
4. Base your analysis on patterns in the data

### Required Analysis:
1. Personality Type: 
   - Choose from: ["The Explorer", "The Romantic", "The Rebel", "The Intellectual", "The Socializer", "The Nostalgic", "The Trendsetter"]
   - Or create a new appropriate type with 1-2 word label and description

2. Music Analytics:
   - Identify top 5 genres
   - Estimate mood distribution (assign percentages that sum to 100)
   - Assess overall energy level (low/medium/high)
   - Other audio features (rate 1-10 where applicable)

3. Psychological Insights:
   - 3-5 bullet points about what the music suggests
   - Focus on personality traits, not just musical preferences

### User Music Data:
{formatted_data}

### Response Format (STRICT JSON ONLY):
{{
  "personality_type": {{
    "label": "",
    "description": ""
  }},
  "analytics": {{
    "top_genres": [],
    "mood_distribution": {{
      "happy": 0,
      "melancholic": 0,
      "energetic": 0,
      "calm": 0,
      "angsty": 0
    }},
    "audio_features": {{
      "energy_level": "",
      "danceability": 0,
      "acousticness": 0,
      "instrumentalness": 0,
      "complexity": 0
    }}
  }},
  "insights": [
    "",
    "",
    ""
  ],
  "recommendations": {{
    "similar_artists": [],
    "growth_opportunities": []
  }}
}}

IMPORTANT:
- Respond with ONLY the JSON object
- Do not include any explanatory text
- Ensure all brackets and quotes are properly closed
- Maintain consistent formatting
"""
        
        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-ai/deepseek-v3",
            "messages": [
                {"role": "system", "content": "You are a music psychologist that analyzes people's music taste and provides insights about their personality."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7
        }
        
        response = requests.post(settings.OPENROUTER_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        return response.json()['choices'][0]['message']['content']

    @staticmethod
    def generate_playlist(data, mood=None, additional_prompt=""):
        formatted_data = format_spotify_data_for_ai(data)
        
        prompt = f"""
        Based on the user's music taste below, generate a playlist recommendation.
        The playlist should include specific track IDs from the user's preferences or similar tracks.
        
        {f"Focus on this mood: {mood}" if mood else ""}
        {additional_prompt if additional_prompt else ""}
        
        User Music Data:
        {formatted_data}
        
        Respond in JSON format with:
        {{
            "name": "Playlist name based on analysis",
            "description": "Playlist description explaining why these tracks were chosen",
            "tracks": ["spotify:track:track_id_1", "spotify:track:track_id_2", ...]
        }}
        """
        
        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek-ai/deepseek-v3",
            "messages": [
                {"role": "system", "content": "You are a music curator that creates personalized playlists based on user preferences."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.8
        }
        
        response = requests.post(settings.OPENROUTER_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        return response.json()['choices'][0]['message']['content']