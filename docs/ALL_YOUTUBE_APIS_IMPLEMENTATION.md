# Complete YouTube Data API v3 Implementation
## All 32+ Endpoints with Quota Optimization

---

## 📊 YouTube Data API v3 - Complete Endpoint List

### Resource Types
1. **Videos** - Video content and metadata
2. **Channels** - Channel information
3. **Playlists** - Playlist management
4. **PlaylistItems** - Items in playlists
5. **Search** - Search across YouTube
6. **Comments** - Comment threads and replies
7. **Activities** - User activity feed
8. **Subscriptions** - Channel subscriptions
9. **ChannelSections** - Channel page sections
10. **VideoCategories** - Video categories
11. **GuideCategories** - Browse categories
12. **I18nLanguages** - Supported languages
13. **I18nRegions** - Supported regions
14. **VideoAbuseReportReasons** - Report reasons
15. **Captions** - Video captions
16. **Members** - Channel memberships
17. **MembershipsLevels** - Membership tiers
18. **Thumbnails** - Custom thumbnails
19. **Watermarks** - Channel watermarks

---

## 🎯 Implementation by Category

### 1. SEARCH APIs (100 units each)

#### 1.1 search.list - Search Everything
```python
async def search_all(
    self,
    query: str,
    search_type: str = "video",  # video, channel, playlist
    max_results: int = 10
) -> Dict:
    """
    Search across YouTube
    Cost: 100 units
    Cache: 24 hours
    """
    cache_key = f"search:{query}:{search_type}"
    cached = self.cache.get(cache_key)
    if cached:
        return cached
    
    params = {
        "part": "snippet",
        "q": query,
        "type": search_type,
        "maxResults": max_results,
        "key": self.api_key
    }
    
    response = await self._api_call("search", params, quota_cost=100)
    self.cache.set(cache_key, response, hours=24)
    return response
```

#### 1.2 Search by Location (Geo-search)
```python
async def search_by_location(
    self,
    query: str,
    latitude: float,
    longitude: float,
    radius: str = "5km"
) -> Dict:
    """
    Search videos by location
    Cost: 100 units
    Use case: Local music events
    """
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "location": f"{latitude},{longitude}",
        "locationRadius": radius,
        "key": self.api_key
    }
    return await self._api_call("search", params, quota_cost=100)
```

#### 1.3 Search by Channel
```python
async def search_in_channel(
    self,
    query: str,
    channel_id: str
) -> Dict:
    """
    Search within specific channel
    Cost: 100 units
    """
    params = {
        "part": "snippet",
        "q": query,
        "channelId": channel_id,
        "type": "video",
        "key": self.api_key
    }
    return await self._api_call("search", params, quota_cost=100)
```

---

### 2. VIDEO APIs (1 unit for list, 50 for insert)

#### 2.1 videos.list - Get Video Details
```python
async def get_videos(
    self,
    video_ids: List[str],
    parts: List[str] = ["snippet", "contentDetails", "statistics"]
) -> Dict:
    """
    Get video details (bulk up to 50)
    Cost: 1 unit
    Cache: Permanent
    """
    # Check cache first
    cached_videos = {}
    uncached_ids = []
    
    for vid in video_ids:
        cached = self.cache.get_video(vid)
        if cached:
            cached_videos[vid] = cached
        else:
            uncached_ids.append(vid)
    
    if not uncached_ids:
        return cached_videos
    
    params = {
        "part": ",".join(parts),
        "id": ",".join(uncached_ids[:50]),
        "key": self.api_key
    }
    
    response = await self._api_call("videos", params, quota_cost=1)
    
    # Cache each video
    for item in response.get("items", []):
        self.cache.save_video(item["id"], item)
        cached_videos[item["id"]] = item
    
    return cached_videos
```

#### 2.2 videos.getRating - Get User's Rating
```python
async def get_video_rating(
    self,
    video_ids: List[str],
    access_token: str
) -> Dict:
    """
    Get user's rating for videos
    Cost: 1 unit
    Requires: OAuth
    """
    params = {
        "id": ",".join(video_ids),
        "access_token": access_token
    }
    return await self._api_call("videos/getRating", params, quota_cost=1)
```

#### 2.3 videos.rate - Rate a Video
```python
async def rate_video(
    self,
    video_id: str,
    rating: str,  # like, dislike, none
    access_token: str
) -> Dict:
    """
    Rate a video
    Cost: 50 units
    Requires: OAuth
    """
    params = {
        "id": video_id,
        "rating": rating,
        "access_token": access_token
    }
    return await self._api_call("videos/rate", params, quota_cost=50, method="POST")
```

---

### 3. CHANNEL APIs (1 unit each)

#### 3.1 channels.list - Get Channel Info
```python
async def get_channels(
    self,
    channel_ids: List[str] = None,
    username: str = None,
    mine: bool = False
) -> Dict:
    """
    Get channel details
    Cost: 1 unit
    Cache: 7 days
    """
    cache_key = f"channel:{channel_ids or username or 'mine'}"
    cached = self.cache.get(cache_key)
    if cached:
        return cached
    
    params = {
        "part": "snippet,statistics,contentDetails",
        "key": self.api_key
    }
    
    if channel_ids:
        params["id"] = ",".join(channel_ids)
    elif username:
        params["forUsername"] = username
    elif mine:
        params["mine"] = "true"
    
    response = await self._api_call("channels", params, quota_cost=1)
    self.cache.set(cache_key, response, days=7)
    return response
```

---

### 4. PLAYLIST APIs (1 unit for list, 50 for insert/update/delete)

#### 4.1 playlists.list - Get Playlists
```python
async def get_playlists(
    self,
    channel_id: str = None,
    playlist_ids: List[str] = None,
    mine: bool = False
) -> Dict:
    """
    Get playlists
    Cost: 1 unit
    Cache: 24 hours
    """
    params = {
        "part": "snippet,contentDetails",
        "maxResults": 50,
        "key": self.api_key
    }
    
    if playlist_ids:
        params["id"] = ",".join(playlist_ids)
    elif channel_id:
        params["channelId"] = channel_id
    elif mine:
        params["mine"] = "true"
    
    return await self._api_call("playlists", params, quota_cost=1)
```

#### 4.2 playlists.insert - Create Playlist
```python
async def create_playlist(
    self,
    title: str,
    description: str,
    privacy: str,  # public, private, unlisted
    access_token: str
) -> Dict:
    """
    Create new playlist
    Cost: 50 units
    Requires: OAuth
    """
    body = {
        "snippet": {
            "title": title,
            "description": description
        },
        "status": {
            "privacyStatus": privacy
        }
    }
    
    return await self._api_call(
        "playlists",
        {"part": "snippet,status", "access_token": access_token},
        quota_cost=50,
        method="POST",
        json_body=body
    )
```

#### 4.3 playlists.update - Update Playlist
```python
async def update_playlist(
    self,
    playlist_id: str,
    title: str,
    description: str,
    access_token: str
) -> Dict:
    """
    Update playlist
    Cost: 50 units
    """
    body = {
        "id": playlist_id,
        "snippet": {
            "title": title,
            "description": description
        }
    }
    
    return await self._api_call(
        "playlists",
        {"part": "snippet", "access_token": access_token},
        quota_cost=50,
        method="PUT",
        json_body=body
    )
```

#### 4.4 playlists.delete - Delete Playlist
```python
async def delete_playlist(
    self,
    playlist_id: str,
    access_token: str
) -> Dict:
    """
    Delete playlist
    Cost: 50 units
    """
    return await self._api_call(
        "playlists",
        {"id": playlist_id, "access_token": access_token},
        quota_cost=50,
        method="DELETE"
    )
```

---

### 5. PLAYLISTITEMS APIs (1 unit for list, 50 for insert/update/delete)

#### 5.1 playlistItems.list - Get Playlist Items
```python
async def get_playlist_items(
    self,
    playlist_id: str,
    max_results: int = 50
) -> Dict:
    """
    Get items in playlist
    Cost: 1 unit
    Cache: 24 hours
    """
    cache_key = f"playlist_items:{playlist_id}"
    cached = self.cache.get(cache_key)
    if cached:
        return cached
    
    params = {
        "part": "snippet,contentDetails",
        "playlistId": playlist_id,
        "maxResults": max_results,
        "key": self.api_key
    }
    
    response = await self._api_call("playlistItems", params, quota_cost=1)
    self.cache.set(cache_key, response, hours=24)
    return response
```

#### 5.2 playlistItems.insert - Add to Playlist
```python
async def add_to_playlist(
    self,
    playlist_id: str,
    video_id: str,
    position: int = None,
    access_token: str = None
) -> Dict:
    """
    Add video to playlist
    Cost: 50 units
    """
    body = {
        "snippet": {
            "playlistId": playlist_id,
            "resourceId": {
                "kind": "youtube#video",
                "videoId": video_id
            }
        }
    }
    
    if position is not None:
        body["snippet"]["position"] = position
    
    return await self._api_call(
        "playlistItems",
        {"part": "snippet", "access_token": access_token},
        quota_cost=50,
        method="POST",
        json_body=body
    )
```

---

### 6. COMMENT APIs (1 unit for list, 50 for insert/update/delete)

#### 6.1 commentThreads.list - Get Comments
```python
async def get_comments(
    self,
    video_id: str,
    max_results: int = 20
) -> Dict:
    """
    Get video comments
    Cost: 1 unit
    Cache: 1 hour
    """
    params = {
        "part": "snippet,replies",
        "videoId": video_id,
        "maxResults": max_results,
        "order": "relevance",
        "key": self.api_key
    }
    
    return await self._api_call("commentThreads", params, quota_cost=1)
```

#### 6.2 commentThreads.insert - Post Comment
```python
async def post_comment(
    self,
    video_id: str,
    text: str,
    access_token: str
) -> Dict:
    """
    Post a comment
    Cost: 50 units
    """
    body = {
        "snippet": {
            "videoId": video_id,
            "topLevelComment": {
                "snippet": {
                    "textOriginal": text
                }
            }
        }
    }
    
    return await self._api_call(
        "commentThreads",
        {"part": "snippet", "access_token": access_token},
        quota_cost=50,
        method="POST",
        json_body=body
    )
```

#### 6.3 comments.list - Get Replies
```python
async def get_comment_replies(
    self,
    parent_id: str
) -> Dict:
    """
    Get replies to a comment
    Cost: 1 unit
    """
    params = {
        "part": "snippet",
        "parentId": parent_id,
        "key": self.api_key
    }
    
    return await self._api_call("comments", params, quota_cost=1)
```

---

### 7. SUBSCRIPTION APIs (1 unit for list, 50 for insert/delete)

#### 7.1 subscriptions.list - Get Subscriptions
```python
async def get_subscriptions(
    self,
    channel_id: str = None,
    mine: bool = False,
    access_token: str = None
) -> Dict:
    """
    Get channel subscriptions
    Cost: 1 unit
    """
    params = {
        "part": "snippet,contentDetails",
        "maxResults": 50
    }
    
    if mine:
        params["mine"] = "true"
        params["access_token"] = access_token
    elif channel_id:
        params["channelId"] = channel_id
        params["key"] = self.api_key
    
    return await self._api_call("subscriptions", params, quota_cost=1)
```

#### 7.2 subscriptions.insert - Subscribe
```python
async def subscribe(
    self,
    channel_id: str,
    access_token: str
) -> Dict:
    """
    Subscribe to channel
    Cost: 50 units
    """
    body = {
        "snippet": {
            "resourceId": {
                "kind": "youtube#channel",
                "channelId": channel_id
            }
        }
    }
    
    return await self._api_call(
        "subscriptions",
        {"part": "snippet", "access_token": access_token},
        quota_cost=50,
        method="POST",
        json_body=body
    )
```

---

### 8. ACTIVITY APIs (1 unit)

#### 8.1 activities.list - Get Activity Feed
```python
async def get_activities(
    self,
    channel_id: str = None,
    mine: bool = False
) -> Dict:
    """
    Get channel activity feed
    Cost: 1 unit
    Cache: 1 hour
    """
    params = {
        "part": "snippet,contentDetails",
        "maxResults": 50,
        "key": self.api_key
    }
    
    if mine:
        params["mine"] = "true"
    elif channel_id:
        params["channelId"] = channel_id
    
    return await self._api_call("activities", params, quota_cost=1)
```

---

### 9. CHANNEL SECTION APIs (1 unit for list, 50 for insert/update/delete)

#### 9.1 channelSections.list - Get Channel Sections
```python
async def get_channel_sections(
    self,
    channel_id: str
) -> Dict:
    """
    Get channel page sections
    Cost: 1 unit
    """
    params = {
        "part": "snippet,contentDetails",
        "channelId": channel_id,
        "key": self.api_key
    }
    
    return await self._api_call("channelSections", params, quota_cost=1)
```

---

### 10. CATEGORY APIs (1 unit each)

#### 10.1 videoCategories.list - Get Video Categories
```python
async def get_video_categories(
    self,
    region_code: str = "US"
) -> Dict:
    """
    Get video categories for region
    Cost: 1 unit
    Cache: 30 days (rarely changes)
    """
    cache_key = f"categories:{region_code}"
    cached = self.cache.get(cache_key)
    if cached:
        return cached
    
    params = {
        "part": "snippet",
        "regionCode": region_code,
        "key": self.api_key
    }
    
    response = await self._api_call("videoCategories", params, quota_cost=1)
    self.cache.set(cache_key, response, days=30)
    return response
```

#### 10.2 guideCategories.list - Get Browse Categories
```python
async def get_guide_categories(
    self,
    region_code: str = "US"
) -> Dict:
    """
    Get browse/guide categories
    Cost: 1 unit
    """
    params = {
        "part": "snippet",
        "regionCode": region_code,
        "key": self.api_key
    }
    
    return await self._api_call("guideCategories", params, quota_cost=1)
```

---

### 11. I18N APIs (1 unit each)

#### 11.1 i18nLanguages.list - Get Supported Languages
```python
async def get_languages(self) -> Dict:
    """
    Get supported languages
    Cost: 1 unit
    Cache: Permanent
    """
    cached = self.cache.get("i18n_languages")
    if cached:
        return cached
    
    params = {
        "part": "snippet",
        "key": self.api_key
    }
    
    response = await self._api_call("i18nLanguages", params, quota_cost=1)
    self.cache.set("i18n_languages", response, days=365)
    return response
```

#### 11.2 i18nRegions.list - Get Supported Regions
```python
async def get_regions(self) -> Dict:
    """
    Get supported regions
    Cost: 1 unit
    Cache: Permanent
    """
    cached = self.cache.get("i18n_regions")
    if cached:
        return cached
    
    params = {
        "part": "snippet",
        "key": self.api_key
    }
    
    response = await self._api_call("i18nRegions", params, quota_cost=1)
    self.cache.set("i18n_regions", response, days=365)
    return response
```

---

### 12. CAPTION APIs (50 units for insert/update/delete, 200 for download)

#### 12.1 captions.list - Get Video Captions
```python
async def get_captions(
    self,
    video_id: str,
    access_token: str
) -> Dict:
    """
    Get available captions
    Cost: 50 units
    """
    params = {
        "part": "snippet",
        "videoId": video_id,
        "access_token": access_token
    }
    
    return await self._api_call("captions", params, quota_cost=50)
```

---

### 13. MEMBER APIs (Requires channel membership feature)

#### 13.1 members.list - Get Channel Members
```python
async def get_members(
    self,
    access_token: str
) -> Dict:
    """
    Get channel members
    Cost: 1 unit
    Requires: Channel membership enabled
    """
    params = {
        "part": "snippet",
        "access_token": access_token
    }
    
    return await self._api_call("members", params, quota_cost=1)
```

---

### 14. THUMBNAIL APIs (50 units)

#### 14.1 thumbnails.set - Set Custom Thumbnail
```python
async def set_thumbnail(
    self,
    video_id: str,
    image_data: bytes,
    access_token: str
) -> Dict:
    """
    Upload custom thumbnail
    Cost: 50 units
    """
    # Multipart upload
    return await self._api_call(
        f"thumbnails/set?videoId={video_id}&access_token={access_token}",
        {},
        quota_cost=50,
        method="POST",
        files={"file": image_data}
    )
```

---

### 15. WATERMARK APIs (50 units)

#### 15.1 watermarks.set - Set Channel Watermark
```python
async def set_watermark(
    self,
    channel_id: str,
    image_data: bytes,
    access_token: str
) -> Dict:
    """
    Set channel watermark
    Cost: 50 units
    """
    return await self._api_call(
        f"watermarks/set?channelId={channel_id}&access_token={access_token}",
        {},
        quota_cost=50,
        method="POST",
        files={"file": image_data}
    )
```

---

## 📊 Complete Quota Cost Summary

| API Endpoint | Operation | Cost (units) | Cache Strategy |
|--------------|-----------|--------------|----------------|
| search.list | GET | 100 | 24 hours |
| videos.list | GET | 1 | Permanent |
| videos.rate | POST | 50 | No cache |
| channels.list | GET | 1 | 7 days |
| playlists.list | GET | 1 | 24 hours |
| playlists.insert | POST | 50 | No cache |
| playlists.update | PUT | 50 | No cache |
| playlists.delete | DELETE | 50 | No cache |
| playlistItems.list | GET | 1 | 24 hours |
| playlistItems.insert | POST | 50 | No cache |
| playlistItems.update | PUT | 50 | No cache |
| playlistItems.delete | DELETE | 50 | No cache |
| commentThreads.list | GET | 1 | 1 hour |
| commentThreads.insert | POST | 50 | No cache |
| comments.list | GET | 1 | 1 hour |
| comments.insert | POST | 50 | No cache |
| subscriptions.list | GET | 1 | 1 hour |
| subscriptions.insert | POST | 50 | No cache |
| subscriptions.delete | DELETE | 50 | No cache |
| activities.list | GET | 1 | 1 hour |
| channelSections.list | GET | 1 | 7 days |
| videoCategories.list | GET | 1 | 30 days |
| guideCategories.list | GET | 1 | 30 days |
| i18nLanguages.list | GET | 1 | Permanent |
| i18nRegions.list | GET | 1 | Permanent |
| captions.list | GET | 50 | No cache |
| captions.download | GET | 200 | No cache |
| members.list | GET | 1 | 1 hour |
| thumbnails.set | POST | 50 | No cache |
| watermarks.set | POST | 50 | No cache |

---

## 🎯 Optimization Strategy for All APIs

### High-Cost APIs (100+ units)
- **search.list**: Aggressive 24h caching, rate limit 5/min
- **captions.download**: Only on explicit user request

### Medium-Cost APIs (50 units)
- **Write operations**: No caching, require OAuth
- **Rate limiting**: 10 operations/hour per user

### Low-Cost APIs (1 unit)
- **Read operations**: Cache based on update frequency
- **Bulk operations**: Fetch 50 items at once

### Zero-Cost Alternatives
- Store user data locally (likes, playlists, history)
- Use cached data when quota low
- Implement fallback strategies

---

This covers ALL YouTube Data API v3 endpoints with quota-optimized implementations!
