from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    spotify_id = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=1024)
    refresh_token = models.CharField(max_length=1024)
    token_expires = models.DateTimeField()

    class Meta:
        db_table = 'users'

class UserAnalysis(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE) 
    personality_type = models.CharField(max_length=255)
    music_analytics = models.JSONField()
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_analyses'

class GeneratedPlaylist(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    playlist_id = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    description = models.TextField()
    generated_at = models.DateTimeField(auto_now_add=True)
    mood = models.CharField(max_length=255, null=True, blank=True)
    prompt = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'generated_playlists'
