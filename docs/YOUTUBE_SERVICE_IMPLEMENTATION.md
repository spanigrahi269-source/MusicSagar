# YouTube Service Implementation

## Central YouTube Service Manager

```python
# app/services/youtube_service.py

import httpx
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.models.cache import SearchCache, Video, Channel
from app.services.cache_service import CacheService
from app.services.quota_service import QuotaService
import os

class YouTubeService:
    """
    Central YouTube API manager
    All YouTube API calls must go through this service
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.cache = CacheService(db)
        self.quota = QuotaService(db)
        self.api_key = os.getenv("YOUTUBE_API_KEY")
        self.base_url = "https://www.googleapis.com/youtube/v3"
    
    # ==========================================
    # SEARCH (100 units)
    # ==========================================
    
    async def search(
        self, 
        query: str, 
        language: str = "all",
        max_results: int = 10
    ) -> Dict:
        """
        Smart search with caching
        1. Check cache first
        2. If not found, call API
        3. Save to cache
        4. Track quota
        """
        
        # Step 1: Check cache
        cached = self.cache.get_search(query, language)
        if cached:
            return {
                "results": cached["results"],
                "from_cache": True,
                "quota_used": 0
            }
        
        # Step 2: Check quota availability
        if not self.quota.can_use_quota(100):
            # Return cached results only or error
            return {
                "error": "Daily quota exceeded",
                "quota_used": 0
            }
        
        # Step 3: Call YouTube API
        try:
            params = {
                "part": "snippet",
                "q": query,
                "type": "video",
                "videoCategoryId": "10",  # Music
                "maxResults": max_results,
                "key": self.api_key
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/search",
                    params=params,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
            
            # Step 4: Extract video IDs for bulk fetch
            video_ids = [item["id"]["videoId"] for item in data.get("items", [])]
            
            # Step 5: Fetch video details in bulk (1 unit for 50 videos)
            video_details = await self.get_videos_bulk(video_ids)
            
            # Step 6: Merge data
            results = []
            for item in data.get("items", []):
                video_id = item["id"]["videoId"]
                detail = video_details.get(video_id, {})
                
                results.append({
                    "videoId": video_id,
                    "title": item["snippet"]["title"],
                    "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                    "channelTitle": item["snippet"]["channelTitle"],
                    "channelId": item["snippet"]["channelId"],
                    "duration": detail.get("duration"),
                    "viewCount": detail.get("viewCount"),
                    "publishedAt": item["snippet"]["publishedAt"]
                })
            
            # Step 7: Save to cache (24 hours)
            self.cache.save_search(query, language, results, hours=24)
            
            # Step 8: Track quota
            self.quota.track_usage("search", 100)
            
            return {
                "results": results,
                "from_cache": False,
                "quota_used": 100
            }
            
        except Exception as e:
            print(f"Search error: {e}")
            # Return empty or cached results
            return {"error": str(e), "results": []}
    
    # ==========================================
    # VIDEO DETAILS (1 unit per 50 videos)
    # ==========================================
    
    async def get_videos_bulk(self, video_ids: List[str]) -> Dict:
        """
        Fetch multiple video details in one API call
        Cost: 1 unit per request (up to 50 videos)
        """
        
        if not video_ids:
            return {}
        
        # Check cache first
        cached_videos = {}
        uncached_ids = []
        
        for video_id in video_ids:
            cached = self.cache.get_video(video_id)
            if cached:
                cached_videos[video_id] = cached
            else:
                uncached_ids.append(video_id)
        
        # If all cached, return
        if not uncached_ids:
            return cached_videos
        
        # Check quota
        if not self.quota.can_use_quota(1):
            return cached_videos  # Return what we have
        
        # Fetch from API (max 50 at a time)
        try:
            video_ids_str = ",".join(uncached_ids[:50])
            
            params = {
                "part": "snippet,contentDetails,statistics",
                "id": video_ids_str,
                "key": self.api_key
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/videos",
                    params=params,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
            
            # Process and cache
            for item in data.get("items", []):
                video_id = item["id"]
                video_data = {
                    "videoId": video_id,
                    "title": item["snippet"]["title"],
                    "channelId": item["snippet"]["channelId"],
                    "channelTitle": item["snippet"]["channelTitle"],
                    "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                    "duration": self._parse_duration(
                        item["contentDetails"]["duration"]
                    ),
                    "viewCount": int(item["statistics"].get("viewCount", 0)),
                    "likeCount": int(item["statistics"].get("likeCount", 0)),
                    "publishedAt": item["snippet"]["publishedAt"],
                    "description": item["snippet"]["description"],
                    "tags": item["snippet"].get("tags", [])
                }
                
                # Save to cache (permanent)
                self.cache.save_video(video_id, video_data)
                cached_videos[video_id] = video_data
            
            # Track quota
            self.quota.track_usage("videos", 1)
            
            return cached_videos
            
        except Exception as e:
            print(f"Bulk video fetch error: {e}")
            return cached_videos
    
    # ==========================================
    # CHANNEL DETAILS (1 unit)
    # ==========================================
    
    async def get_channel(self, channel_id: str) -> Optional[Dict]:
        """
        Get channel details with 7-day cache
        Cost: 1 unit
        """
        
        # Check cache
        cached = self.cache.get_channel(channel_id)
        if cached:
            return cached
        
        # Check quota
        if not self.quota.can_use_quota(1):
            return None
        
        try:
            params = {
                "part": "snippet,statistics",
                "id": channel_id,
                "key": self.api_key
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/channels",
                    params=params,
                    timeout=10.0
                )
                response.raise_for_status()
                data = response.json()
            
            if not data.get("items"):
                return None
            
            item = data["items"][0]
            channel_data = {
                "channelId": channel_id,
                "title": item["snippet"]["title"],
                "description": item["snippet"]["description"],
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                "subscriberCount": int(item["statistics"].get("subscriberCount", 0)),
                "videoCount": int(item["statistics"].get("videoCount", 0)),
                "viewCount": int(item["statistics"].get("viewCount", 0))
            }
            
            # Cache for 7 days
            self.cache.save_channel(channel_id, channel_data, days=7)
            self.quota.track_usage("channels", 1)
            
            return channel_data
            
        except Exception as e:
            print(f"Channel fetch error: {e}")
            return None
    
    # ==========================================
    # HELPER METHODS
    # ==========================================
    
    def _parse_duration(self, iso_duration: str) -> str:
        """Convert PT3M45S to 3:45"""
        import re
        pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
        match = re.match(pattern, iso_duration)
        
        if not match:
            return "0:00"
        
        hours = int(match.group(1)) if match.group(1) else 0
        minutes = int(match.group(2)) if match.group(2) else 0
        seconds = int(match.group(3)) if match.group(3) else 0
        
        if hours > 0:
            return f"{hours}:{minutes:02d}:{seconds:02d}"
        return f"{minutes}:{seconds:02d}"
```

## Usage Example

```python
# In router
from app.services.youtube_service import YouTubeService

@router.get("/search")
async def search_music(
    query: str,
    db: Session = Depends(get_db)
):
    youtube = YouTubeService(db)
    results = await youtube.search(query, max_results=10)
    return results
```
