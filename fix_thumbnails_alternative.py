"""
Alternative thumbnail fix - Update database to use different YouTube thumbnail URLs
"""
import sqlite3

# Different YouTube thumbnail URL formats to try:
# 1. https://img.youtube.com/vi/VIDEO_ID/0.jpg (default)
# 2. https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg (medium quality)
# 3. https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg (high quality)
# 4. https://img.youtube.com/vi/VIDEO_ID/sddefault.jpg (standard)
# 5. https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg (max quality)

def update_thumbnail_urls():
    """Update all thumbnail URLs to use img.youtube.com instead of i.ytimg.com"""
    conn = sqlite3.connect('backend/music_sagar.db')
    cursor = conn.cursor()
    
    # Get all songs
    cursor.execute("SELECT id, youtube_video_id, thumbnail FROM songs")
    songs = cursor.fetchall()
    
    print(f"Found {len(songs)} songs in database")
    print("Updating thumbnail URLs...")
    
    updated = 0
    for song_id, video_id, old_thumbnail in songs:
        # Use img.youtube.com format (more reliable)
        new_thumbnail = f"https://img.youtube.com/vi/{video_id}/mqdefault.jpg"
        
        if old_thumbnail != new_thumbnail:
            cursor.execute(
                "UPDATE songs SET thumbnail = ? WHERE id = ?",
                (new_thumbnail, song_id)
            )
            updated += 1
            print(f"  Updated: {video_id}")
    
    conn.commit()
    conn.close()
    
    print(f"\n✅ Updated {updated} thumbnail URLs")
    print("New format: https://img.youtube.com/vi/VIDEO_ID/mqdefault.jpg")

if __name__ == "__main__":
    update_thumbnail_urls()
