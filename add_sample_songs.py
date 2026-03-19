"""
Add sample songs to database for testing
These are just for display - users will search for real songs
"""
import sqlite3

# Sample songs for display (these won't play embedded, but that's OK now!)
SAMPLE_SONGS = [
    {
        "youtube_video_id": "kJa2kwoZ2a4",
        "title": "Kesariya - Brahmastra | Ranbir Kapoor | Alia Bhatt",
        "channel": "Sony Music India",
        "thumbnail": "https://img.youtube.com/vi/kJa2kwoZ2a4/mqdefault.jpg"
    },
    {
        "youtube_video_id": "RLzC55ai0eo",
        "title": "Apna Bana Le - Bhediya | Varun Dhawan, Kriti Sanon",
        "channel": "T-Series",
        "thumbnail": "https://img.youtube.com/vi/RLzC55ai0eo/mqdefault.jpg"
    },
    {
        "youtube_video_id": "IIgJV8WRXQY",
        "title": "Tum Hi Ho - Aashiqui 2 | Arijit Singh",
        "channel": "T-Series",
        "thumbnail": "https://img.youtube.com/vi/IIgJV8WRXQY/mqdefault.jpg"
    },
    {
        "youtube_video_id": "YGLBK1S8WS8",
        "title": "Chaleya - Jawan | Shah Rukh Khan",
        "channel": "T-Series",
        "thumbnail": "https://img.youtube.com/vi/YGLBK1S8WS8/mqdefault.jpg"
    },
    {
        "youtube_video_id": "JFcgOboQZ08",
        "title": "Raataan Lambiyan - Shershaah",
        "channel": "Sony Music India",
        "thumbnail": "https://img.youtube.com/vi/JFcgOboQZ08/mqdefault.jpg"
    },
    {
        "youtube_video_id": "QIbKjS1e0eU",
        "title": "Deva Deva - Brahmastra",
        "channel": "Sony Music India",
        "thumbnail": "https://img.youtube.com/vi/QIbKjS1e0eU/mqdefault.jpg"
    },
    {
        "youtube_video_id": "kUNqHF47p5A",
        "title": "Pal Pal Dil Ke Paas - Kishore Kumar",
        "channel": "Saregama Music",
        "thumbnail": "https://img.youtube.com/vi/kUNqHF47p5A/mqdefault.jpg"
    },
    {
        "youtube_video_id": "vlkNxI8q7yI",
        "title": "Tere Hawaale - Laal Singh Chaddha",
        "channel": "Sony Music India",
        "thumbnail": "https://img.youtube.com/vi/vlkNxI8q7yI/mqdefault.jpg"
    },
    {
        "youtube_video_id": "Hs3YzHi8Eko",
        "title": "Maan Meri Jaan - King",
        "channel": "King",
        "thumbnail": "https://img.youtube.com/vi/Hs3YzHi8Eko/mqdefault.jpg"
    },
    {
        "youtube_video_id": "RRcgj2VhHKQ",
        "title": "Kahani Suno 2.0 - Kaifi Khalil",
        "channel": "Kaifi Khalil",
        "thumbnail": "https://img.youtube.com/vi/RRcgj2VhHKQ/mqdefault.jpg"
    },
    {
        "youtube_video_id": "Dkk9gvTmCXY",
        "title": "Agar Tum Saath Ho - Tamasha",
        "channel": "T-Series",
        "thumbnail": "https://img.youtube.com/vi/Dkk9gvTmCXY/mqdefault.jpg"
    },
    {
        "youtube_video_id": "Bvvffb8sNtk",
        "title": "Tum Se Hi - Jab We Met",
        "channel": "T-Series",
        "thumbnail": "https://img.youtube.com/vi/Bvvffb8sNtk/mqdefault.jpg"
    }
]

def add_songs():
    conn = sqlite3.connect('backend/music_sagar.db')
    cursor = conn.cursor()
    
    print("\n" + "="*80)
    print("Adding Sample Songs to Database")
    print("="*80 + "\n")
    
    # Clear existing songs
    cursor.execute("DELETE FROM songs")
    conn.commit()
    print("✅ Cleared old songs\n")
    
    # Add new songs
    for song in SAMPLE_SONGS:
        try:
            cursor.execute("""
                INSERT INTO songs (youtube_video_id, title, thumbnail, channel)
                VALUES (?, ?, ?, ?)
            """, (song['youtube_video_id'], song['title'], song['thumbnail'], song['channel']))
            print(f"✅ Added: {song['title']}")
        except Exception as e:
            print(f"❌ Failed to add {song['title']}: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"\n{'='*80}")
    print(f"✅ Added {len(SAMPLE_SONGS)} songs to database")
    print(f"{'='*80}\n")
    print("NOTE: These songs will open in YouTube when clicked.")
    print("Users can search for any song they want using the Search feature!")

if __name__ == "__main__":
    add_songs()
