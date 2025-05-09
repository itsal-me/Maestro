from django.contrib import admin
from django.urls import path
from core.views import (
    SpotifyAuthView,
    SpotifyCallbackView,
    AnalyzeUserView,
    GeneratePlaylistView,
    UserAnalysesView,
    UserPlaylistsView,
    UserProfileView,
    RefreshTokenView
)

urlpatterns = [
    path('auth/spotify/', SpotifyAuthView.as_view(), name='spotify-auth'),
    path('auth/spotify/callback/', SpotifyCallbackView.as_view(), name='spotify-callback'),
    path('auth/spotify/refresh-token/', RefreshTokenView.as_view(), name='refresh-token'),
    path('analyze/', AnalyzeUserView.as_view(), name='analyze-user'),
    path('users/<int:user_id>/profile/', UserProfileView.as_view(), name='user-profile'),
    path('generate-playlist/', GeneratePlaylistView.as_view(), name='generate-playlist'),
    path('users/<int:user_id>/analyses/', UserAnalysesView.as_view(), name='user-analyses'),
    path('users/<int:user_id>/playlists/', UserPlaylistsView.as_view(), name='user-playlists'),
]