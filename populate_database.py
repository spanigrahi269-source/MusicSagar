"""
Populate database with initial songs for testing recommendations
This adds popular Hindi songs to the database so users can see recommendations immediately
"""

import sys
import os

# Make sure we're using the backend database
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

# Change to backend directory to use correct database
os.chdir(os.path.join(os.path.dirname(__file__), 'backend'))

from app.database import SessionLocal
from app.models import Song

# Popular Hindi songs with real YouTube data
INITIAL_SONGS = [
    {
        "youtube_video_id": "kJa2kwoZ2a4",
        "title": "Kesariya - Brahmastra | Ranbir Kapoor | Alia Bhatt | Pritam | Arijit Singh",
        "channel": "Sony Music India",
        "thumbnail": "https://i.ytimg.com/vi/kJa2kwoZ2a4/mqdefault.jpg"
    },
    {
        "youtube_video_id": "RLzC55ai0eo",
        "title": "Apna Bana Le - Bhediya | Varun Dhawan, Kriti Sanon | Sachin-Jigar, Arijit Singh",
        "channel": "T-Series",
        "thumbnail": "https://i.ytimg.com/vi/RLzC55ai0eo/mqdefault.jpg"
    },
    {
        "youtube_video_id": "IIgJV8WRXQY",
        "title": "Tum Hi Ho - Aashiqui 2 | Aditya Roy Kapur, Shraddha Kapoor | Arijit Singh",
        "channel": "T-Series",
        "thumbnail": "https://i.ytimg.com/vi/IIgJV8WRXQY/mqdefault.jpg"
    },
    {
        "youtube_video_id": "YGLBK1S8WS8",
        "title": "Chaleya - Jawan | Shah Rukh Khan | Nayanthara | Anirudh | Arijit Singh",
        "channel": "T-Series",
        "thumbnail": "https://i.ytimg.com/vi/YGLBK1S8WS8/mqdefault.jpg"
    },
    {
        "youtube_video_id": "JFcgOboQZ08",
        "title": "Raataan Lambiyan - Shershaah | Sidharth–Kiara | Tanishk Bagchi | Jubin Nautiyal",
        "channel": "Sony Music India",
        "thumbnail": "https://i.ytimg.com/vi/JFcgOboQZ08/mqdefault.jpg"
    },
    {
        "youtube_video_id": "QIbKjS1e0eU",
        "title": "Deva Deva - Brahmastra | Ranbir Kapoor, Alia Bhatt | Pritam, Arijit Singh",
        "channel": "Sony Music India",
        "thumbnail": "https://i.ytimg.com/vi/QIbKjS1e0eU/mqdefault.jpg"
    },
    {
        "youtube_video_id": "kUNqHF47p5A",
        "title": "Pal Pal Dil Ke Paas - Kishore Kumar | Dharmendra | Rakesh Roshan",
        "channel": "Saregama Music",
        "thumbnail": "https://i.ytimg.com/vi/kUNqHF47p5A/mqdefault.jpg"
    },
    {
        "youtube_video_id": "vlkNxI8q7yI",
        "title": "Tere Hawaale - Laal Singh Chaddha | Arijit Singh | Pritam | Aamir Khan",
        "channel": "Sony Music India",
        "thumbnail": "https://i.ytimg.com/vi/vlkNxI8q7yI/mqdefault.jpg"
    },
    {
        "youtube_video_id": "Hs3YzHi8Eko",
        "title": "Maan Meri Jaan - King | Champagne Talk | Latest Hit Song 2023",
        "channel": "King",
        "thumbnail": "https://i.ytimg.com/vi/Hs3YzHi8Eko/mqdefault.jpg"
    },
    {
        "youtube_video_id": "RRcgj2VhHKQ",
        "title": "Kahani Suno 2.0 - Kaifi Khalil | Latest Viral Song 2023",
        "channel": "Kaifi Khalil",
        "thumbnail": "https://i.ytimg.com/vi/RRcgj2VhHKQ/mqdefault.jpg"
    },
    {
        "youtube_video_id": "Dkk9gvTmCXY",
        "title": "Agar Tum Saath Ho - Tamasha | Ranbir Kapoor, Deepika | Alka Yagnik, Arijit Singh",
        "channel": "T-Series",
        "thumbnail": "https://i.ytimg.com/vi/Dkk9gvTmCXY/mqdefault.jpg"
    },
    {
        "youtube_video_id": "Bvvffb8sNtk",
        "title": "Tum Se Hi - Jab We Met | Shahid Kapoor, Kareena Kapoor | Mohit Chauhan",
        "channel": "T-Series",
        "thumbnail": "https://i.ytimg.com/vi/Bvvffb8sNtk/mqdefault.jpg"
    },
    {
        "youtube_video_id": "QqccaKQJRLo",
        "title": "Sajni - Arijit Singh | Laapataa Ladies | Ram Sampath | Aamir Khan Productions",
        "channel": "Saregama Music",
        "thumbnail": "https://i.ytimg.com/vi/QqccaKQJRLo/mqdefault.jpg"
    },
    {
        "youtube_video_id": "Uj3_bmBh-NI",
        "title": "Phir Aur Kya Chahiye - Zara Hatke Zara Bachke | Vicky Kaushal | Arijit Singh",
        "channel": "Zee Music Company",
        "thumbnail": "https://i.ytimg.com/vi/Uj3_bmBh-NI/mqdefault.jpg"
    },
    {
        "youtube_video_id": "kXWBzKPMvb8",
        "title": "O Maahi - Dunki | Shah Rukh Khan | Taapsee Pannu | Pritam | Arijit Singh",
        "channel": "T-Series",
        "thumbnail": "https://i.ytimg.com/vi/kXWBzKPMvb8/mqdefault.jpg"
    }
]

def populate_database():
    """Add initial songs to database"""
    db = SessionLocal()
    
    try:
        # Check existing songs
        existing_count = db.query(Song).count()
        print(f"📊 Current songs in database: {existing_count}")
        
        added_count = 0
        skipped_count = 0
        
        for song_data in INITIAL_SONGS:
            # Check if song already exists
            existing = db.query(Song).filter(
                Song.youtube_video_id == song_data["youtube_video_id"]
            ).first()
            
            if existing:
                print(f"⏭️  Skipped: {song_data['title'][:50]}... (already exists)")
                skipped_count += 1
                continue
            
            # Add new song
            song = Song(
                youtube_video_id=song_data["youtube_video_id"],
                title=song_data["title"],
                channel=song_data["channel"],
                thumbnail=song_data["thumbnail"]
            )
            db.add(song)
            print(f"✅ Added: {song_data['title'][:50]}...")
            added_count += 1
        
        db.commit()
        
        # Final count
        final_count = db.query(Song).count()
        
        print(f"\n{'='*60}")
        print(f"🎉 Database Population Complete!")
        print(f"{'='*60}")
        print(f"📊 Songs before: {existing_count}")
        print(f"➕ Songs added: {added_count}")
        print(f"⏭️  Songs skipped: {skipped_count}")
        print(f"📊 Songs after: {final_count}")
        print(f"{'='*60}")
        
        if final_count >= 12:
            print(f"✅ SUCCESS! Database now has {final_count} songs (minimum 12 required)")
            print(f"🎵 Recommendations will now show 12+ songs!")
        else:
            print(f"⚠️  Database has {final_count} songs (need 12 for full recommendations)")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🎵 Music Sagar - Database Population Script")
    print("=" * 60)
    populate_database()
