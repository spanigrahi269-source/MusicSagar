import sqlite3

conn = sqlite3.connect('backend/music_sagar.db')
cursor = conn.cursor()

cursor.execute('SELECT COUNT(*) FROM songs')
total = cursor.fetchone()[0]
print(f'Total songs in database: {total}')

if total > 0:
    cursor.execute('SELECT title, channel FROM songs LIMIT 5')
    print('\nSample songs:')
    for row in cursor.fetchall():
        print(f'  - {row[0][:60]} by {row[1]}')

conn.close()
