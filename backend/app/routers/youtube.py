import os
import httpx
from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
import asyncio

router = APIRouter(prefix="/youtube", tags=["YouTube"])

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"
YOUTUBE_VIDEOS_URL = "https://www.googleapis.com/youtube/v3/videos"

# Track failed API keys
failed_keys = set()

def get_youtube_api_key():
    """Get the next available YouTube API key with automatic rotation"""
    # Try all 30 keys in order (maximum quota capacity!)
    for i in range(1, 31):
        key_name = f"YOUTUBE_API_KEY_{i}"
        api_key = os.getenv(key_name)
        
        if api_key and key_name not in failed_keys:
            return api_key, key_name
    
    # If all keys failed, reset and try again
    failed_keys.clear()
    return os.getenv("YOUTUBE_API_KEY_1"), "YOUTUBE_API_KEY_1"

def mark_key_as_failed(key_name: str):
    """Mark an API key as failed (quota exceeded)"""
    failed_keys.add(key_name)
    print(f"Marked {key_name} as failed. Failed keys: {len(failed_keys)}/30")


def parse_iso8601_duration(duration: str) -> Optional[str]:
    """
    Convert ISO 8601 duration format to readable format
    
    Args:
        duration: ISO 8601 duration string (e.g., "PT3M45S")
    
    Returns:
        Formatted duration string (e.g., "3:45") or None if parsing fails
    """
    if not duration:
        return None
    
    try:
        import re
        pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
        match = re.match(pattern, duration)
        
        if not match:
            return None
        
        hours = int(match.group(1)) if match.group(1) else 0
        minutes = int(match.group(2)) if match.group(2) else 0
        seconds = int(match.group(3)) if match.group(3) else 0
        
        if hours > 0:
            return f"{hours}:{minutes:02d}:{seconds:02d}"
        else:
            return f"{minutes}:{seconds:02d}"
    
    except Exception:
        return None


async def fetch_video_durations(video_ids: List[str], api_key: str) -> dict:
    """
    Fetch video durations from YouTube API (non-blocking with timeout)
    
    Args:
        video_ids: List of YouTube video IDs
        api_key: YouTube API key
    
    Returns:
        Dictionary mapping video_id to formatted duration string
    """
    if not video_ids:
        return {}
    
    try:
        # YouTube API allows up to 50 video IDs per request
        video_ids_str = ",".join(video_ids[:50])
        
        params = {
            "part": "contentDetails",
            "id": video_ids_str,
            "key": api_key
        }
        
        # Set timeout to 3 seconds to prevent blocking
        async with httpx.AsyncClient(timeout=3.0) as client:
            response = await client.get(YOUTUBE_VIDEOS_URL, params=params)
            response.raise_for_status()
            data = response.json()
        
        # Parse durations
        durations = {}
        for item in data.get("items", []):
            video_id = item["id"]
            iso_duration = item.get("contentDetails", {}).get("duration", "")
            formatted_duration = parse_iso8601_duration(iso_duration)
            if formatted_duration:
                durations[video_id] = formatted_duration
        
        return durations
    
    except asyncio.TimeoutError:
        print("Duration fetch timed out - returning empty durations")
        return {}
    except Exception as e:
        print(f"Error fetching video durations: {e}")
        return {}


@router.get("/search")
async def search_youtube(query: str, language: str = "", pageToken: str = None):
    """Search YouTube for music videos with optional language filter and pagination"""
    # Get API key with automatic rotation
    YOUTUBE_API_KEY, key_name = get_youtube_api_key()
    
    if not YOUTUBE_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="All YouTube API keys have exceeded their quota. Please try again after midnight Pacific Time."
        )
    
    # Add language keyword to query if specified
    search_query = query
    if language and language != "all":
        language_keywords = {
            "hindi": "hindi",
            "english": "english",
            "punjabi": "punjabi",
            "marathi": "marathi",
            "tamil": "tamil",
            "telugu": "telugu"
        }
        if language.lower() in language_keywords:
            search_query = f"{query} {language_keywords[language.lower()]}"
    
    params = {
        "part": "snippet",
        "q": search_query,
        "type": "video",
        "videoCategoryId": "10",  # Music category
        "maxResults": 20,
        "key": YOUTUBE_API_KEY
    }
    
    # Add pageToken for pagination
    if pageToken:
        params["pageToken"] = pageToken
    
    try:
        # Fetch search results with timeout
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(YOUTUBE_SEARCH_URL, params=params)
            
            # Check for quota exceeded error
            if response.status_code == 403:
                error_data = response.json()
                error_reason = error_data.get('error', {}).get('errors', [{}])[0].get('reason', 'unknown')
                
                if 'quota' in error_reason.lower():
                    # Mark this key as failed and try next key
                    mark_key_as_failed(key_name)
                    
                    # Try with next available key
                    YOUTUBE_API_KEY, key_name = get_youtube_api_key()
                    if not YOUTUBE_API_KEY:
                        raise HTTPException(
                            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                            detail="All YouTube API keys have exceeded their quota. Please try again after midnight Pacific Time."
                        )
                    
                    # Retry with new key
                    params["key"] = YOUTUBE_API_KEY
                    response = await client.get(YOUTUBE_SEARCH_URL, params=params)
            
            response.raise_for_status()
            data = response.json()
        
        # Format results first (without duration)
        results = []
        video_ids = []
        
        for item in data.get("items", []):
            video_id = item["id"]["videoId"]
            video_ids.append(video_id)
            results.append({
                "videoId": video_id,
                "title": item["snippet"]["title"],
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                "channelTitle": item["snippet"]["channelTitle"],
                "duration": None  # Will be filled if duration fetch succeeds
            })
        
        # Try to fetch durations (non-blocking, with fallback)
        try:
            durations = await asyncio.wait_for(
                fetch_video_durations(video_ids, YOUTUBE_API_KEY),
                timeout=3.0
            )
            
            # Update results with durations
            for result in results:
                if result["videoId"] in durations:
                    result["duration"] = durations[result["videoId"]]
        
        except asyncio.TimeoutError:
            # Duration fetch timed out - continue without durations
            print("Duration fetch timed out - returning results without durations")
        except Exception as e:
            # Duration fetch failed - continue without durations
            print(f"Duration fetch failed: {e}")
        
        return {
            "results": results,
            "nextPageToken": data.get("nextPageToken"),
            "prevPageToken": data.get("prevPageToken")
        }
    
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"YouTube API error: {str(e)}"
        )
