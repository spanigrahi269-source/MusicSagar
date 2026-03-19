from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
import os
from ..database import get_db
from ..models import Song, History, Playlist, Like, User
from ..auth import get_current_user

router = APIRouter(prefix="/stats", tags=["Statistics"])

# Try to import requests, but don't fail if not available
try:
    import requests
    REQUESTS_AVAILABLE = True
except ImportError:
    REQUESTS_AVAILABLE = False
    print("Warning: requests library not available. YouTube API fallback disabled.")

@router.get("/trending")
def get_trending_songs(db: Session = Depends(get_db)):
    """Get most played songs across all users"""
    trending = db.query(
        Song,
        func.count(History.id).label('play_count')
    ).join(
        History, Song.id == History.song_id
    ).group_by(
        Song.id
    ).order_by(
        desc('play_count')
    ).limit(20).all()
    
    result = []
    for song, play_count in trending:
        result.append({
            "youtube_video_id": song.youtube_video_id,
            "title": song.title,
            "thumbnail": song.thumbnail,
            "channel": song.channel,
            "play_count": play_count
        })
    
    return {"trending": result}

@router.get("/recommendations")
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Simple recommendation system:
    1. If user has liked songs → recommend songs from same artists
    2. If no liked songs → show trending songs (most played)
    3. Always return at least 12 songs
    """
    
    try:
        import random
        
        recommendations = []
        message = ""
        source = ""
        
        # Strategy 1: User has liked songs → recommend from same artists
        liked_songs = db.query(Song).join(
            Like, Song.id == Like.song_id
        ).filter(
            Like.user_id == current_user.id
        ).limit(10).all()
        
        if liked_songs:
            print(f"User has {len(liked_songs)} liked songs, recommending from same artists")
            
            # Get unique artists from liked songs
            liked_artists = set()
            for song in liked_songs:
                if song.channel:
                    liked_artists.add(song.channel)
            
            # Get songs from these artists (excluding already liked songs)
            liked_song_ids = set(song.id for song in liked_songs)
            
            for artist in liked_artists:
                artist_songs = db.query(Song).filter(
                    Song.channel == artist,
                    Song.id.notin_(liked_song_ids)
                ).limit(10).all()
                recommendations.extend(artist_songs)
            
            message = "💕 Based on artists you liked"
            source = "liked_artists"
        
        # Strategy 2: Add trending songs (most played) to reach 50
        if len(recommendations) < 50:
            print(f"Getting trending songs (current count: {len(recommendations)})")
            
            trending = db.query(
                Song,
                func.count(History.id).label('play_count')
            ).join(
                History, Song.id == History.song_id
            ).group_by(
                Song.id
            ).order_by(
                desc('play_count')
            ).limit(50).all()
            
            # Add trending songs
            existing_ids = set(song.id for song in recommendations)
            for song, _ in trending:
                if song.id not in existing_ids and len(recommendations) < 50:
                    recommendations.append(song)
            
            if not liked_songs:
                message = "🔥 Trending songs"
                source = "trending"
            else:
                message = "💕 Based on artists you liked"
                source = "liked_artists_plus_trending"
        
        # Strategy 3: Still not enough → get any songs from database
        if len(recommendations) < 50:
            print(f"Getting random songs (current count: {len(recommendations)})")
            
            existing_ids = set(song.id for song in recommendations)
            random_songs = db.query(Song).filter(
                Song.id.notin_(existing_ids)
            ).limit(50).all()
            
            recommendations.extend(random_songs)
            
            if not message:
                message = "🎵 Songs from your library"
                source = "random"
        
        # Shuffle for variety
        random.shuffle(recommendations)
        
        # Return up to 50 songs (so "Show More" can work)
        final_recommendations = recommendations[:50]
        
        print(f"Returning {len(final_recommendations)} recommendations (source: {source})")
        
        # Format for frontend
        result = []
        for song in final_recommendations:
            result.append({
                "youtube_video_id": song.youtube_video_id,
                "title": song.title,
                "thumbnail": song.thumbnail,
                "channel": song.channel
            })
        
        return {
            "recommendations": result,
            "source": source,
            "message": message,
            "total": len(result)
        }
    
    except Exception as e:
        print(f"Error in recommendations: {e}")
        import traceback
        traceback.print_exc()
        
        # Emergency fallback
        try:
            emergency_songs = db.query(Song).limit(50).all()
            result = []
            for song in emergency_songs:
                result.append({
                    "youtube_video_id": song.youtube_video_id,
                    "title": song.title,
                    "thumbnail": song.thumbnail,
                    "channel": song.channel
                })
            
            return {
                "recommendations": result,
                "source": "emergency",
                "message": "🎵 Songs from your library",
                "total": len(result)
            }
        except:
            return {
                "recommendations": [],
                "source": "error",
                "message": "⚠️ Unable to load recommendations",
                "total": 0
            }


def fetch_songs_by_artist(artist_name: str, api_key: str, max_results: int = 6):
    """Fetch songs from the same artist using YouTube search"""
    try:
        params = {
            "part": "snippet",
            "q": f"{artist_name} songs",
            "type": "video",
            "videoCategoryId": "10",  # Music category
            "maxResults": max_results,
            "order": "viewCount",
            "key": api_key
        }
        
        response = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params=params,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            results = []
            
            for item in data.get("items", []):
                # Filter out shorts, interviews, non-music content
                title = item["snippet"]["title"].lower()
                if any(word in title for word in ["interview", "short", "trailer", "teaser", "behind the scenes"]):
                    continue
                
                results.append({
                    "videoId": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "channelTitle": item["snippet"]["channelTitle"],
                    "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"]
                })
            
            return results
        
        return []
    except Exception as e:
        print(f"Error fetching songs by artist: {e}")
        return []


def fetch_similar_songs(song_title: str, api_key: str, max_results: int = 6):
    """Fetch similar songs using keywords from song title"""
    try:
        # Extract keywords (remove common words)
        keywords = song_title.replace("Official", "").replace("Video", "").replace("Audio", "").replace("Lyric", "").strip()
        
        params = {
            "part": "snippet",
            "q": f"{keywords}",
            "type": "video",
            "videoCategoryId": "10",  # Music category
            "maxResults": max_results,
            "order": "relevance",
            "key": api_key
        }
        
        response = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params=params,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            results = []
            
            for item in data.get("items", []):
                # Filter out shorts, interviews, non-music content
                title = item["snippet"]["title"].lower()
                if any(word in title for word in ["interview", "short", "trailer", "teaser", "behind the scenes"]):
                    continue
                
                results.append({
                    "videoId": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "channelTitle": item["snippet"]["channelTitle"],
                    "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"]
                })
            
            return results
        
        return []
    except Exception as e:
        print(f"Error fetching similar songs: {e}")
        return []


def fetch_trending_india(api_key: str, max_results: int = 15):
    """Fetch trending music videos in India"""
    try:
        # Try trending videos endpoint
        params = {
            "part": "snippet",
            "chart": "mostPopular",
            "regionCode": "IN",
            "videoCategoryId": "10",  # Music category
            "maxResults": max_results,
            "key": api_key
        }
        
        response = requests.get(
            "https://www.googleapis.com/youtube/v3/videos",
            params=params,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            results = []
            
            for item in data.get("items", []):
                # Filter out shorts, interviews, non-music content
                title = item["snippet"]["title"].lower()
                if any(word in title for word in ["interview", "short", "trailer", "teaser"]):
                    continue
                
                results.append({
                    "videoId": item["id"],
                    "title": item["snippet"]["title"],
                    "channelTitle": item["snippet"]["channelTitle"],
                    "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"]
                })
            
            if len(results) >= 10:
                return results
        
        # Fallback: Search for trending Indian music
        search_params = {
            "part": "snippet",
            "q": "trending hindi songs 2024",
            "type": "video",
            "videoCategoryId": "10",
            "maxResults": max_results,
            "order": "viewCount",
            "regionCode": "IN",
            "key": api_key
        }
        
        response = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params=search_params,
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            results = []
            
            for item in data.get("items", []):
                title = item["snippet"]["title"].lower()
                if any(word in title for word in ["interview", "short", "trailer", "teaser"]):
                    continue
                
                results.append({
                    "videoId": item["id"]["videoId"],
                    "title": item["snippet"]["title"],
                    "channelTitle": item["snippet"]["channelTitle"],
                    "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"]
                })
            
            return results
        
        return []
    except Exception as e:
        print(f"Error fetching trending India: {e}")
        return []

@router.get("/analytics")
def get_user_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user analytics"""
    total_songs_played = db.query(func.count(History.id)).filter(
        History.user_id == current_user.id
    ).scalar()
    
    total_playlists = db.query(func.count(Playlist.id)).filter(
        Playlist.user_id == current_user.id
    ).scalar()
    
    total_likes = db.query(func.count(Like.id)).filter(
        Like.user_id == current_user.id
    ).scalar()
    
    return {
        "total_songs_played": total_songs_played or 0,
        "total_playlists": total_playlists or 0,
        "total_likes": total_likes or 0
    }

@router.post("/like/{youtube_video_id}")
def like_song(
    youtube_video_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Like a song"""
    # Get or create song
    song = db.query(Song).filter(Song.youtube_video_id == youtube_video_id).first()
    if not song:
        return {"error": "Song not found"}
    
    # Check if already liked
    existing_like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.song_id == song.id
    ).first()
    
    if existing_like:
        return {"message": "Already liked"}
    
    # Create like
    like = Like(user_id=current_user.id, song_id=song.id)
    db.add(like)
    db.commit()
    
    return {"message": "Song liked"}

@router.delete("/like/{youtube_video_id}")
def unlike_song(
    youtube_video_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unlike a song"""
    # Get song
    song = db.query(Song).filter(Song.youtube_video_id == youtube_video_id).first()
    if not song:
        return {"error": "Song not found"}
    
    # Find and delete like
    like = db.query(Like).filter(
        Like.user_id == current_user.id,
        Like.song_id == song.id
    ).first()
    
    if like:
        db.delete(like)
        db.commit()
        return {"message": "Song unliked"}
    
    return {"message": "Not liked"}

@router.get("/liked")
def get_liked_songs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's liked songs"""
    likes = db.query(Like, Song).join(
        Song, Like.song_id == Song.id
    ).filter(
        Like.user_id == current_user.id
    ).order_by(
        desc(Like.created_at)
    ).all()
    
    result = []
    for like, song in likes:
        result.append({
            "youtube_video_id": song.youtube_video_id,
            "title": song.title,
            "thumbnail": song.thumbnail,
            "channel": song.channel,
            "liked_at": like.created_at.isoformat()
        })
    
    return {"liked_songs": result}

@router.get("/related-artists")
def get_related_artists(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get related artists based on user's listening history and liked songs
    Returns artist names and thumbnails for "Fans also like" section
    """
    
    YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
    use_youtube_api = YOUTUBE_API_KEY and REQUESTS_AVAILABLE
    
    try:
        # Get unique artists from user's liked songs and history
        liked_artists = db.query(Song.channel).join(
            Like, Song.id == Like.song_id
        ).filter(
            Like.user_id == current_user.id
        ).distinct().limit(5).all()
        
        history_artists = db.query(Song.channel).join(
            History, Song.id == History.song_id
        ).filter(
            History.user_id == current_user.id
        ).distinct().limit(5).all()
        
        # Combine and get unique artist names
        all_artists = set()
        for (artist,) in liked_artists:
            if artist:
                all_artists.add(artist)
        for (artist,) in history_artists:
            if artist:
                all_artists.add(artist)
        
        related_artists = []
        
        # Try YouTube API first
        if use_youtube_api and all_artists:
            # Get artists from user's listening history
            for artist in list(all_artists)[:3]:  # Use top 3 artists
                artists = fetch_similar_artists(artist, YOUTUBE_API_KEY, max_results=3)
                related_artists.extend(artists)
                if len(related_artists) >= 12:
                    break
            
            # If still not enough, fetch trending music artists
            if len(related_artists) < 8:
                trending = fetch_trending_artists(YOUTUBE_API_KEY, max_results=8)
                related_artists.extend(trending.get("artists", []))
        
        # If YouTube API failed or returned no results, use database fallback
        if len(related_artists) == 0:
            print("YouTube API failed for artists, using database fallback")
            
            # Get all unique artists from database
            db_artists = db.query(Song.channel).filter(
                Song.channel.isnot(None)
            ).distinct().limit(20).all()
            
            # Create artist objects with fallback (no thumbnail, will use gradient)
            for (artist_name,) in db_artists:
                if artist_name and len(related_artists) < 8:
                    related_artists.append({
                        "name": artist_name,
                        "thumbnail": ""  # Empty thumbnail will trigger gradient fallback
                    })
        
        # Remove duplicates and limit to 8
        seen_names = set()
        unique_artists = []
        for artist in related_artists:
            if artist["name"] not in seen_names and len(unique_artists) < 8:
                seen_names.add(artist["name"])
                unique_artists.append(artist)
        
        print(f"Returning {len(unique_artists)} artists")
        return {"artists": unique_artists}
    
    except Exception as e:
        print(f"Error fetching related artists: {e}")
        import traceback
        traceback.print_exc()
        
        # Emergency fallback - return artists from database
        try:
            db_artists = db.query(Song.channel).filter(
                Song.channel.isnot(None)
            ).distinct().limit(8).all()
            
            result = []
            for (artist_name,) in db_artists:
                if artist_name:
                    result.append({
                        "name": artist_name,
                        "thumbnail": ""
                    })
            
            return {"artists": result}
        except:
            return {"artists": []}


def fetch_similar_artists(artist_name: str, api_key: str, max_results: int = 4):
    """Fetch similar artists using YouTube channel search"""
    try:
        # First, try to get the actual artist's channel
        params = {
            "part": "snippet",
            "q": artist_name,
            "type": "channel",
            "maxResults": 1,
            "key": api_key
        }
        
        response = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params=params,
            timeout=10
        )
        
        results = []
        
        if response.status_code == 200:
            data = response.json()
            
            # Add the main artist first
            for item in data.get("items", []):
                thumbnails = item["snippet"]["thumbnails"]
                thumbnail_url = (
                    thumbnails.get("high", {}).get("url") or
                    thumbnails.get("medium", {}).get("url") or
                    thumbnails.get("default", {}).get("url") or
                    ""
                )
                
                results.append({
                    "name": item["snippet"]["channelTitle"],
                    "thumbnail": thumbnail_url
                })
        
        # Then search for similar/related artists
        if len(results) < max_results:
            similar_params = {
                "part": "snippet",
                "q": f"{artist_name} music artist",
                "type": "channel",
                "maxResults": max_results,
                "key": api_key
            }
            
            similar_response = requests.get(
                "https://www.googleapis.com/youtube/v3/search",
                params=similar_params,
                timeout=10
            )
            
            if similar_response.status_code == 200:
                similar_data = similar_response.json()
                
                for item in similar_data.get("items", []):
                    if len(results) >= max_results:
                        break
                    
                    thumbnails = item["snippet"]["thumbnails"]
                    thumbnail_url = (
                        thumbnails.get("high", {}).get("url") or
                        thumbnails.get("medium", {}).get("url") or
                        thumbnails.get("default", {}).get("url") or
                        ""
                    )
                    
                    channel_name = item["snippet"]["channelTitle"]
                    
                    # Avoid duplicates
                    if not any(a["name"] == channel_name for a in results):
                        results.append({
                            "name": channel_name,
                            "thumbnail": thumbnail_url
                        })
        
        return results
    except Exception as e:
        print(f"Error fetching similar artists: {e}")
        return []


def fetch_trending_artists(api_key: str, max_results: int = 8):
    """Fetch trending music artists/channels"""
    try:
        params = {
            "part": "snippet",
            "q": "trending music artists india",
            "type": "channel",
            "maxResults": max_results,
            "key": api_key
        }
        
        response = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params=params,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            results = []
            
            for item in data.get("items", []):
                # Try to get the best available thumbnail
                thumbnails = item["snippet"]["thumbnails"]
                thumbnail_url = (
                    thumbnails.get("high", {}).get("url") or
                    thumbnails.get("medium", {}).get("url") or
                    thumbnails.get("default", {}).get("url") or
                    ""
                )
                
                results.append({
                    "name": item["snippet"]["channelTitle"],
                    "thumbnail": thumbnail_url
                })
            
            return {"artists": results}
        
        return {"artists": []}
    except Exception as e:
        print(f"Error fetching trending artists: {e}")
        return {"artists": []}

