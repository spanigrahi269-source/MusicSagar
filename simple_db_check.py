import sys
import sqlite3

try:
    conn = sqlite3.connect('backend/music_sagar.db')
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM songs")
    count = cursor.fetchone()[0]
    sys.stdout.write(f"SONGS:{count}\n")
    sys.stdout.flush()
    conn.close()
except Exception as e:
    sys.stdout.write(f"ERROR:{e}\n")
    sys.stdout.flush()
