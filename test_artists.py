import requests
import json

# Test credentials
email = "sagar@example.com"
password = "Sagar@269"

# Login to get token
print("🔐 Logging in...")
login_response = requests.post(
    "http://127.0.0.1:8000/auth/login",
    json={"email": email, "password": password}
)

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    print(f"✅ Login successful!")
    
    # Get related artists
    print("\n🎤 Fetching related artists...")
    headers = {"Authorization": f"Bearer {token}"}
    artists_response = requests.get(
        "http://127.0.0.1:8000/stats/related-artists",
        headers=headers
    )
    
    if artists_response.status_code == 200:
        data = artists_response.json()
        artists = data.get("artists", [])
        
        print(f"\n✅ Got {len(artists)} artists")
        
        if len(artists) > 0:
            print("\n📝 Artists:")
            for i, artist in enumerate(artists, 1):
                print(f"  {i}. {artist['name']}")
                print(f"     Thumbnail: {artist.get('thumbnail', 'No thumbnail')[:80]}...")
        else:
            print("\n⚠️ No artists returned!")
    else:
        print(f"❌ Failed to get artists: {artists_response.status_code}")
        print(artists_response.text)
else:
    print(f"❌ Login failed: {login_response.status_code}")
    print(login_response.text)
