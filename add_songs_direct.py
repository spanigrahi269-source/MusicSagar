"""
Add songs directly to database using YouTube API
"""
import os
import sqlite3
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
load_dotenv('backend/.env')

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY_1') or os.getenv('YOUTUBE_API_KEY')
YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

def search_youtube(query, max_results=10):
    """Search YouTube directly"""
    params = {
        "part": "snippet",
        "q": query,
        "type": "video",
        "videoCategoryId": "10",  # Music category
        "maxResults": max_results,
        "key": YOUTUBE_API_KEY
    }
    
    try:
        response = requests.get(YOUTUBE_SEARCH_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        results = []
        for item in data.get("items", []):
            results.append({
                "videoId": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "thumbnail": item["snippet"]["thumbnails"]["high"]["url"],
                "channelTitle": item["snippet"]["channelTitle"]
            })
        
        return results
    except Exception as e:
        print(f"Error searching YouTube: {e}")
        return []

def add_songs_to_db(songs):
    """Add songs to database"""
    conn = sqlite3.connect('backend/music_sagar.db')
    cursor = conn.cursor()
    
    added = 0
    for song in songs:
        try:
            # Check if song already exists
            cursor.execute(
                "SELECT id FROM songs WHERE youtube_video_id = ?",
                (song['videoId'],)
            )
            
            if cursor.fetchone() is None:
                # Insert song
                cursor.execute("""
                    INSERT INTO songs (youtube_video_id, title, thumbnail, channel)
                    VALUES (?, ?, ?, ?)
                """, (
                    song['videoId'],
                    song['title'],
                    song['thumbnail'],
                    song['channelTitle']
                ))
                added += 1
                print(f"  ✅ Added: {song['title'][:60]}")
        except Exception as e:
            print(f"  ⚠️  Error adding song: {e}")
    
    conn.commit()
    conn.close()
    return added

def main():
    print("\n" + "="*80)
    print("ADDING SONGS TO DATABASE")
    print("="*80)
    
    if not YOUTUBE_API_KEY:
        print("\n❌ YouTube API key not found!")
        return
    
    print(f"\n✅ YouTube API Key found")
    
    # Search queries
    queries = [
        "arijit singh hits",
        "trending hindi songs 2024",
        "bollywood songs",
        "english pop songs",
        "latest music 2024"
    ]
    
    total_added = 0
    for query in queries:
        print(f"\n🔍 Searching: {query}")
        songs = search_youtube(query, max_results=10)
        print(f"Found {len(songs)} songs")
        added = add_songs_to_db(songs)
        total_added += added
    
    # Show final count
    conn = sqlite3.connect('backend/music_sagar.db')
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM songs")
    total_songs = cursor.fetchone()[0]
    conn.close()
    
    print("\n" + "="*80)
    print("COMPLETE")
    print("="*80)
    print(f"\n✅ Total songs in database: {total_songs}")
    print(f"✅ New songs added: {total_added}")
    print("\n🎉 Refresh your browser to see songs on home page!")

if __name__ == "__main__":
    main()
