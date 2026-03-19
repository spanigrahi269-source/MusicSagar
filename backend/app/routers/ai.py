"""
AI-powered features router
Includes mood-based search and intelligent recommendations
"""
import os
import httpx
from fastapi import APIRouter, HTTPException, status, Query
from typing import Optional

router = APIRouter(prefix="/ai", tags=["AI Features"])

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"


def map_mood_to_keywords(value: int, language: str = "Hindi") -> str:
    """
    Map mood slider value (0-100) to search keywords
    
    Args:
        value: Mood intensity from 0 (sad) to 100 (energetic)
        language: Music language preference
    
    Returns:
        Search query string optimized for mood
    """
    # Normalize language
    lang = language.lower()
    
    # Map value ranges to mood keywords
    if value <= 20:
        # Sad/Melancholic (0-20)
        keywords = {
            "hindi": "sad hindi slow emotional songs",
            "english": "sad emotional slow english songs",
            "punjabi": "sad punjabi slow songs",
            "all": "sad slow emotional songs"
        }
        mood_label = "Sad"
        
    elif value <= 40:
        # Calm/Peaceful (21-40)
        keywords = {
            "hindi": "calm lofi bollywood peaceful songs",
            "english": "calm peaceful acoustic english songs",
            "punjabi": "calm punjabi sufi songs",
            "all": "calm peaceful lofi songs"
        }
        mood_label = "Calm"
        
    elif value <= 60:
        # Neutral/Romantic (41-60)
        keywords = {
            "hindi": "romantic hindi love songs",
            "english": "romantic love english songs",
            "punjabi": "romantic punjabi songs",
            "all": "romantic love songs"
        }
        mood_label = "Romantic"
        
    elif value <= 80:
        # Happy/Upbeat (61-80)
        keywords = {
            "hindi": "happy bollywood dance upbeat songs",
            "english": "happy upbeat pop english songs",
            "punjabi": "happy punjabi bhangra songs",
            "all": "happy upbeat dance songs"
        }
        mood_label = "Happy"
        
    else:
        # Energetic/Party (81-100)
        keywords = {
            "hindi": "energetic workout party hindi punjabi songs",
            "english": "energetic workout edm english songs",
            "punjabi": "energetic punjabi bhangra party songs",
            "all": "energetic workout party songs"
        }
        mood_label = "Energetic"
    
    # Get keyword for language, fallback to 'all'
    query = keywords.get(lang, keywords.get("all"))
    
    return query, mood_label


def get_mood_emoji(value: int) -> str:
    """Get emoji representation for mood value"""
    if value <= 20:
        return "😢"
    elif value <= 40:
        return "😌"
    elif value <= 60:
        return "🙂"
    elif value <= 80:
        return "😄"
    else:
        return "🤩"


@router.get("/mood-slider")
async def mood_based_search(
    value: int = Query(..., ge=0, le=100, description="Mood intensity (0-100)"),
    language: str = Query("Hindi", description="Music language"),
    max_results: int = Query(15, ge=1, le=50, description="Number of results")
):
    """
    Search songs based on mood slider value
    
    Args:
        value: Mood intensity from 0 (sad) to 100 (energetic)
        language: Preferred music language
        max_results: Number of songs to return
    
    Returns:
        Songs matching the mood with metadata
    """
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
    
    if not YOUTUBE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="YouTube API key not configured"
        )
    
    # Map mood value to search keywords
    search_query, mood_label = map_mood_to_keywords(value, language)
    mood_emoji = get_mood_emoji(value)
    
    # Search YouTube
    params = {
        "part": "snippet",
        "q": search_query,
        "type": "video",
        "videoCategoryId": "10",  # Music category
        "maxResults": max_results,
        "key": YOUTUBE_API_KEY
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(YOUTUBE_SEARCH_URL, params=params)
            response.raise_for_status()
            data = response.json()
        
        # Format results
        results = []
        for item in data.get("items", []):
            results.append({
                "videoId": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                "channelTitle": item["snippet"]["channelTitle"],
                "description": item["snippet"].get("description", "")
            })
        
        return {
            "mood": {
                "value": value,
                "label": mood_label,
                "emoji": mood_emoji,
                "query": search_query
            },
            "results": results,
            "total": len(results)
        }
    
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"YouTube API error: {str(e)}"
        )


@router.get("/mood-info")
async def get_mood_info(value: int = Query(..., ge=0, le=100)):
    """
    Get mood information without searching
    Useful for UI updates
    """
    _, mood_label = map_mood_to_keywords(value, "Hindi")
    mood_emoji = get_mood_emoji(value)
    
    return {
        "value": value,
        "label": mood_label,
        "emoji": mood_emoji
    }



@router.get("/lyrics/{song_title}")
async def get_lyrics(song_title: str):
    """
    Fetch lyrics for a song (placeholder implementation)
    
    In production, integrate with:
    - Genius API
    - Musixmatch API
    - AZLyrics scraper (with permission)
    
    For now, returns a placeholder message
    """
    # This is a placeholder implementation
    # In production, you would integrate with a lyrics API
    
    return {
        "song": song_title,
        "lyrics": [
            {"time": 0, "text": "🎵 Lyrics not available yet"},
            {"time": 3, "text": "This feature requires integration with a lyrics API"},
            {"time": 6, "text": "Popular options:"},
            {"time": 9, "text": "• Genius API"},
            {"time": 12, "text": "• Musixmatch API"},
            {"time": 15, "text": "• AZLyrics (with permission)"},
            {"time": 18, "text": ""},
            {"time": 21, "text": f"Currently playing: {song_title}"},
            {"time": 24, "text": "🎵 Enjoy the music! 🎵"}
        ],
        "available": False,
        "message": "Lyrics API integration pending"
    }
