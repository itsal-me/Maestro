from django.contrib import admin
from django.urls import path
from core.views import (
    SpotifyAuthView,
    SpotifyCallbackView,
    AnalyzeUserView,
    GeneratePlaylistView,
    UserAnalysesView,
    UserPlaylistsView
)

urlpatterns = [
    path('auth/spotify/', SpotifyAuthView.as_view(), name='spotify-auth'),
    path('auth/spotify/callback/', SpotifyCallbackView.as_view(), name='spotify-callback'),
    path('analyze/', AnalyzeUserView.as_view(), name='analyze-user'),
    path('generate-playlist/', GeneratePlaylistView.as_view(), name='generate-playlist'),
    path('users/<int:user_id>/analyses/', UserAnalysesView.as_view(), name='user-analyses'),
    path('users/<int:user_id>/playlists/', UserPlaylistsView.as_view(), name='user-playlists'),
]