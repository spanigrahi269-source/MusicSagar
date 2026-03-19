"""
Clear all songs from database
Users will build their library by searching and adding songs
"""
import sqlite3

def clear_all_songs():
    conn = sqlite3.connect('backend/music_sagar.db')
    cursor = conn.cursor()
    
    print("\n" + "="*80)
    print("CLEARING DATABASE")
    print("="*80 + "\n")
    
    # Get count before clearing
    cursor.execute("SELECT COUNT(*) FROM songs")
    count_before = cursor.fetchone()[0]
    print(f"Songs in database: {count_before}")
    
    # Clear all songs
    cursor.execute("DELETE FROM songs")
    conn.commit()
    
    # Verify cleared
    cursor.execute("SELECT COUNT(*) FROM songs")
    count_after = cursor.fetchone()[0]
    
    conn.close()
    
    print(f"✅ Cleared {count_before} songs")
    print(f"Songs remaining: {count_after}")
    
    print("\n" + "="*80)
    print("DATABASE CLEARED")
    print("="*80 + "\n")
    print("Your app is now a clean slate!")
    print("\nUsers can:")
    print("1. Search for any song using the Search feature")
    print("2. Add songs to playlists")
    print("3. Build their own music library")
    print("4. All songs will open in YouTube when clicked")
    print("\nThis is better because:")
    print("✅ No unavailable videos")
    print("✅ Users find what they want")
    print("✅ Always up-to-date")
    print("✅ Works with ALL music")

if __name__ == "__main__":
    clear_all_songs()
