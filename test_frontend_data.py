import requests
import json

# Test credentials
email = "sagar@example.com"
password = "Sagar@269"

# Login
print("🔐 Logging in...")
login_response = requests.post(
    "http://127.0.0.1:8000/auth/login",
    json={"email": email, "password": password}
)

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get recommendations
    print("\n🎵 Testing recommendations endpoint...")
    recs = requests.get("http://127.0.0.1:8000/stats/recommendations", headers=headers)
    
    if recs.status_code == 200:
        data = recs.json()
        print(f"✅ Got {len(data['recommendations'])} songs")
        print(f"📊 Source: {data['source']}")
        print(f"💬 Message: {data['message']}")
        
        # Check first song
        if data['recommendations']:
            song = data['recommendations'][0]
            print(f"\n📝 First song:")
            print(f"   Title: {song['title'][:50]}...")
            print(f"   Channel: {song['channel']}")
            print(f"   Thumbnail: {song['thumbnail']}")
            print(f"   Video ID: {song['youtube_video_id']}")
    else:
        print(f"❌ Failed: {recs.status_code}")
        print(recs.text)
    
    # Get artists
    print("\n🎤 Testing artists endpoint...")
    artists = requests.get("http://127.0.0.1:8000/stats/related-artists", headers=headers)
    
    if artists.status_code == 200:
        data = artists.json()
        print(f"✅ Got {len(data['artists'])} artists")
        
        if data['artists']:
            artist = data['artists'][0]
            print(f"\n📝 First artist:")
            print(f"   Name: {artist['name']}")
            print(f"   Thumbnail: {artist.get('thumbnail', 'No thumbnail')}")
    else:
        print(f"❌ Failed: {artists.status_code}")
else:
    print(f"❌ Login failed: {login_response.status_code}")
