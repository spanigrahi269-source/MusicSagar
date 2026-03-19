"""
Populate database with initial songs using YouTube API
This will give users something to see on the home page
"""
import os
import sqlite3
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
load_dotenv('backend/.env')

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
BASE_URL = "http://localhost:8000"

def add_songs_from_search(query, limit=10):
    """Search YouTube and add songs to database"""
    print(f"\n🔍 Searching for: {query}")
    
    try:
        # Search using the API
        response = requests.get(
            f"{BASE_URL}/youtube/search",
            params={"query": query},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])[:limit]
            
            print(f"✅ Found {len(results)} songs")
            
            # Add to database
            conn = sqlite3.connect('backend/music_sagar.db')
            cursor = conn.cursor()
            
            added = 0
            for song in results:
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
                        print(f"  ✅ Added: {song['title'][:50]}...")
                except Exception as e:
                    print(f"  ⚠️  Skipped: {e}")
            
            conn.commit()
            conn.close()
            
            print(f"✅ Added {added} new songs to database")
            return added
        else:
            print(f"❌ Search failed: {response.status_code}")
            return 0
    
    except Exception as e:
        print(f"❌ Error: {e}")
        return 0


def main():
    print("\n" + "="*80)
    print("POPULATING DATABASE WITH INITIAL SONGS")
    print("="*80)
    
    if not YOUTUBE_API_KEY:
        print("\n❌ YouTube API key not found!")
        print("Make sure YOUTUBE_API_KEY is set in .env or backend/.env")
        return
    
    print(f"\n✅ YouTube API Key found")
    print(f"✅ Backend URL: {BASE_URL}")
    
    # Check if backend is running
    try:
        response = requests.get(f"{BASE_URL}/youtube/search?query=test", timeout=5)
        print(f"✅ Backend is running")
    except:
        print(f"\n❌ Backend is not running!")
        print(f"Please start the backend first:")
        print(f"  cd backend")
        print(f"  venv\\Scripts\\activate")
        print(f"  python -m uvicorn app.main:app --reload")
        return
    
    # Popular searches to populate database
    searches = [
        ("arijit singh hits", 10),
        ("trending hindi songs", 10),
        ("bollywood songs", 10),
        ("english pop songs", 10),
        ("latest music", 10)
    ]
    
    total_added = 0
    for query, limit in searches:
        added = add_songs_from_search(query, limit)
        total_added += added
    
    # Show final count
    conn = sqlite3.connect('backend/music_sagar.db')
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM songs")
    total_songs = cursor.fetchone()[0]
    conn.close()
    
    print("\n" + "="*80)
    print("POPULATION COMPLETE")
    print("="*80)
    print(f"\n✅ Total songs in database: {total_songs}")
    print(f"✅ New songs added: {total_added}")
    
    print("\n🎉 Your home page will now show recommendations!")
    print("\nNext steps:")
    print("  1. Refresh your browser (Ctrl + Shift + R)")
    print("  2. Go to Home page")
    print("  3. See recommendations!")


if __name__ == "__main__":
    main()
