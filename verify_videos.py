"""
Verify which YouTube videos in the database are still available
"""
import sqlite3
import requests
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY', 'AIzaSyBzpvPUMBZUXwpPrnQ0gDUKBA__Po5jAN4')

def check_video_availability(video_id):
    """Check if a YouTube video is available"""
    url = f"https://www.googleapis.com/youtube/v3/videos"
    params = {
        'part': 'status,contentDetails',
        'id': video_id,
        'key': YOUTUBE_API_KEY
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if 'items' in data and len(data['items']) > 0:
            video = data['items'][0]
            status = video.get('status', {})
            
            # Check if video is embeddable and public
            is_embeddable = status.get('embeddable', False)
            privacy_status = status.get('privacyStatus', 'private')
            upload_status = status.get('uploadStatus', 'deleted')
            
            return {
                'available': True,
                'embeddable': is_embeddable,
                'privacy': privacy_status,
                'status': upload_status,
                'playable': is_embeddable and privacy_status == 'public' and upload_status == 'processed'
            }
        else:
            return {
                'available': False,
                'embeddable': False,
                'privacy': 'unavailable',
                'status': 'deleted',
                'playable': False
            }
    except Exception as e:
        print(f"Error checking video {video_id}: {e}")
        return {
            'available': False,
            'embeddable': False,
            'privacy': 'error',
            'status': 'error',
            'playable': False
        }

def verify_all_videos():
    """Check all videos in the database"""
    conn = sqlite3.connect('backend/music_sagar.db')
    cursor = conn.cursor()
    
    cursor.execute("SELECT id, youtube_video_id, title FROM songs")
    songs = cursor.fetchall()
    
    print(f"\n{'='*80}")
    print(f"Checking {len(songs)} videos in database...")
    print(f"{'='*80}\n")
    
    playable = []
    unavailable = []
    restricted = []
    
    for song_id, video_id, title in songs:
        print(f"Checking: {title[:50]}...")
        result = check_video_availability(video_id)
        
        if result['playable']:
            playable.append((video_id, title))
            print(f"  ✅ PLAYABLE")
        elif result['available'] and not result['embeddable']:
            restricted.append((video_id, title, 'Embedding disabled'))
            print(f"  ⚠️  RESTRICTED: Embedding disabled")
        elif result['available'] and result['privacy'] != 'public':
            restricted.append((video_id, title, f"Privacy: {result['privacy']}"))
            print(f"  ⚠️  RESTRICTED: {result['privacy']}")
        else:
            unavailable.append((video_id, title))
            print(f"  ❌ UNAVAILABLE: {result['status']}")
        
        print()
    
    conn.close()
    
    # Print summary
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}\n")
    print(f"✅ Playable videos: {len(playable)}/{len(songs)}")
    print(f"⚠️  Restricted videos: {len(restricted)}/{len(songs)}")
    print(f"❌ Unavailable videos: {len(unavailable)}/{len(songs)}")
    
    if unavailable:
        print(f"\n{'='*80}")
        print("UNAVAILABLE VIDEOS (Need Replacement)")
        print(f"{'='*80}\n")
        for video_id, title in unavailable:
            print(f"❌ {title}")
            print(f"   Video ID: {video_id}")
            print(f"   URL: https://www.youtube.com/watch?v={video_id}")
            print()
    
    if restricted:
        print(f"\n{'='*80}")
        print("RESTRICTED VIDEOS (May Not Play in App)")
        print(f"{'='*80}\n")
        for video_id, title, reason in restricted:
            print(f"⚠️  {title}")
            print(f"   Video ID: {video_id}")
            print(f"   Reason: {reason}")
            print(f"   URL: https://www.youtube.com/watch?v={video_id}")
            print()
    
    print(f"\n{'='*80}")
    print("RECOMMENDATIONS")
    print(f"{'='*80}\n")
    
    if unavailable:
        print("1. Remove unavailable videos from database")
        print("2. Search for alternative versions of these songs")
        print("3. Add new video IDs to database")
    
    if restricted:
        print("4. Restricted videos may work on YouTube but not in your app")
        print("5. Consider finding alternative uploads with embedding enabled")
    
    if len(playable) < len(songs) * 0.5:
        print("\n⚠️  WARNING: Less than 50% of videos are playable!")
        print("   Consider refreshing your entire song database with current videos.")

if __name__ == "__main__":
    verify_all_videos()
