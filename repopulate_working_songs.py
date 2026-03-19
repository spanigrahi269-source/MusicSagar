"""
Search for and add CURRENT working YouTube videos to database
"""
import sqlite3
import requests
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY', 'AIzaSyBzpvPUMBZUXwpPrnQ0gDUKBA__Po5jAN4')

# Popular Hindi songs to search for
SONGS_TO_SEARCH = [
    "Kesariya Brahmastra Official Video",
    "Apna Bana Le Bhediya Official Video",
    "Tum Hi Ho Aashiqui 2 Official Video",
    "Chaleya Jawan Official Video",
    "Raataan Lambiyan Shershaah Official Video",
    "Deva Deva Brahmastra Official Video",
    "Pal Pal Dil Ke Paas Official Video",
    "Tere Hawaale Laal Singh Chaddha Official Video",
    "Maan Meri Jaan King Official Video",
    "Kahani Suno 2.0 Kaifi Khalil Official Video",
    "Agar Tum Saath Ho Tamasha Official Video",
    "Tum Se Hi Jab We Met Official Video",
    "Sajni Arijit Singh Official Video",
    "Phir Aur Kya Chahiye Official Video",
    "O Maahi Dunki Official Video",
    "Ve Kamleya Rocky Aur Rani Official Video",
    "Satranga Animal Official Video",
    "Arjan Vailly Animal Official Video",
    "Heeriye Jasleen Royal Official Video",
    "Besharam Rang Pathaan Official Video"
]

def search_youtube(query):
    """Search YouTube for a song and return the first embeddable result"""
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        'part': 'snippet',
        'q': query,
        'type': 'video',
        'videoCategoryId': '10',  # Music category
        'maxResults': 5,
        'key': YOUTUBE_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if 'items' in data:
            # Check each result for embeddability
            for item in data['items']:
                video_id = item['id']['videoId']
                
                # Verify video is embeddable
                if check_embeddable(video_id):
                    snippet = item['snippet']
                    return {
                        'video_id': video_id,
                        'title': snippet['title'],
                        'channel': snippet['channelTitle'],
                        'thumbnail': snippet['thumbnails']['medium']['url']
                    }
        
        return None
    except Exception as e:
        print(f"Error searching for '{query}': {e}")
        return None

def check_embeddable(video_id):
    """Check if video is embeddable"""
    url = f"https://www.googleapis.com/youtube/v3/videos"
    params = {
        'part': 'status',
        'id': video_id,
        'key': YOUTUBE_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if 'items' in data and len(data['items']) > 0:
            status = data['items'][0].get('status', {})
            return status.get('embeddable', False) and status.get('privacyStatus') == 'public'
        
        return False
    except:
        return False

def repopulate_database():
    """Clear database and add fresh working videos"""
    conn = sqlite3.connect('backend/music_sagar.db')
    cursor = conn.cursor()
    
    print("\n" + "="*80)
    print("REPOPULATING DATABASE WITH WORKING VIDEOS")
    print("="*80 + "\n")
    
    # Clear existing songs
    print("Clearing old songs...")
    cursor.execute("DELETE FROM songs")
    conn.commit()
    print("✅ Old songs cleared\n")
    
    # Search and add new songs
    added = 0
    failed = 0
    
    for query in SONGS_TO_SEARCH:
        print(f"Searching: {query}...")
        result = search_youtube(query)
        
        if result:
            try:
                cursor.execute("""
                    INSERT INTO songs (youtube_video_id, title, thumbnail, channel)
                    VALUES (?, ?, ?, ?)
                """, (result['video_id'], result['title'], result['thumbnail'], result['channel']))
                conn.commit()
                added += 1
                print(f"  ✅ Added: {result['title'][:60]}")
                print(f"     Video ID: {result['video_id']}")
                print(f"     Channel: {result['channel']}")
            except Exception as e:
                print(f"  ❌ Failed to add: {e}")
                failed += 1
        else:
            print(f"  ⚠️  No embeddable video found")
            failed += 1
        
        print()
    
    conn.close()
    
    # Print summary
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80 + "\n")
    print(f"✅ Successfully added: {added} songs")
    print(f"❌ Failed: {failed} songs")
    print(f"\nTotal songs in database: {added}")
    
    if added > 0:
        print("\n" + "="*80)
        print("NEXT STEPS")
        print("="*80 + "\n")
        print("1. Restart your backend server")
        print("2. Refresh your browser")
        print("3. Songs should now play!")
        print("\nAll videos have been verified as:")
        print("  ✅ Embeddable")
        print("  ✅ Public")
        print("  ✅ Currently available")
    else:
        print("\n⚠️  WARNING: No songs were added!")
        print("   Check your YouTube API key and quota.")

if __name__ == "__main__":
    repopulate_database()
