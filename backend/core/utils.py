import json

def format_spotify_data_for_ai(data):
    user = data.get('user', {})
    top_tracks = data.get('top_tracks', {}).get('items', [])
    top_artists = data.get('top_artists', {}).get('items', [])
    recently_played = data.get('recently_played', {}).get('items', [])
    saved_tracks = data.get('saved_tracks', {}).get('items', [])
    
    formatted = {
        'user': {
            'id': user.get('id'),
            'display_name': user.get('display_name'),
            'country': user.get('country')
        },
        'top_tracks': [{
            'name': track.get('name'),
            'artists': [artist.get('name') for artist in track.get('artists', [])],
            'album': track.get('album', {}).get('name'),
            'popularity': track.get('popularity'),
            'duration_ms': track.get('duration_ms'),
            'id': track.get('id')
        } for track in top_tracks],
        'top_artists': [{
            'name': artist.get('name'),
            'genres': artist.get('genres', []),
            'popularity': artist.get('popularity'),
            'id': artist.get('id')
        } for artist in top_artists],
        'recently_played': [{
            'track': {
                'name': item.get('track', {}).get('name'),
                'artists': [artist.get('name') for artist in item.get('track', {}).get('artists', [])],
                'id': item.get('track', {}).get('id')
            },
            'played_at': item.get('played_at')
        } for item in recently_played],
        'saved_tracks': [{
            'track': {
                'name': item.get('track', {}).get('name'),
                'artists': [artist.get('name') for artist in item.get('track', {}).get('artists', [])],
                'id': item.get('track', {}).get('id')
            },
            'added_at': item.get('added_at')
        } for item in saved_tracks]
    }
    
    return json.dumps(formatted, indent=2)



def normalize_ai_keys(data: dict) -> dict:
    # Flat key replacements at any level
    key_mapping = {
        "insight": "insights",
        "recommendation": "recommendations",
        "analytic": "analytics",
        "similar_artist": "similar_artists",
        "growth_opportunity": "growth_opportunities",
    }

    if not isinstance(data, dict):
        return data

    normalized = {}
    for key, value in data.items():
        new_key = key_mapping.get(key, key)

        # Recursively normalize if value is dict or list of dicts
        if isinstance(value, dict):
            normalized[new_key] = normalize_ai_keys(value)
        elif isinstance(value, list):
            normalized[new_key] = [
                normalize_ai_keys(item) if isinstance(item, dict) else item for item in value
            ]
        else:
            normalized[new_key] = value

    return normalized


def clean_ai_json_response(raw_response: str) -> str:
    import re
    return re.sub(r"^```(?:json)?\s*|\s*```$", "", raw_response.strip(), flags=re.IGNORECASE)

def parse_and_normalize_ai_json(raw_response: str) -> dict:
    cleaned = clean_ai_json_response(raw_response)

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Could not parse AI JSON: {e}")

    return normalize_ai_keys(data)