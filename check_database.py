import sqlite3

# Connect to database
conn = sqlite3.connect('backend/music_sagar.db')
cursor = conn.cursor()

# Check songs count
cursor.execute("SELECT COUNT(*) FROM songs")
song_count = cursor.fetchone()[0]

print(f"Total songs in database: {song_count}")

if song_count > 0:
    # Show first 5 songs
    cursor.execute("SELECT title, channel FROM songs LIMIT 5")
    songs = cursor.fetchall()
    print("\nSample songs:")
    for title, channel in songs:
        print(f"  - {title} by {channel}")
else:
    print("\nNo songs in database!")
    print("This is why recommendations are not showing.")

conn.close()
