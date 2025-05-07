from rest_framework import serializers
from .models import UserAnalysis, GeneratedPlaylist

class UserAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnalysis
        fields = ['id', 'personality_type', 'music_analytics', 'generated_at']

class GeneratedPlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedPlaylist
        fields = ['id', 'playlist_id', 'name', 'description', 'generated_at', 'mood', 'prompt']