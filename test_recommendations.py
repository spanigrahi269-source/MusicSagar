"""
Test script to verify recommendations endpoint works
"""
import requests
import json

# Test credentials
email = "sagar@example.com"
password = "Sagar@269"

print("🔍 Testing Recommendation System...")
print("=" * 50)

# Step 1: Login
print("\n1. Logging in...")
try:
    login_response = requests.post(
        "http://localhost:8000/auth/login",
        json={"email": email, "password": password}
    )
    
    if login_response.status_code == 200:
        token = login_response.json()["access_token"]
        print("✅ Login successful!")
        print(f"   Token: {token[:20]}...")
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"   Response: {login_response.text}")
        exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    print("   Make sure backend is running: cd backend && uvicorn app.main:app --reload")
    exit(1)

# Step 2: Get recommendations
print("\n2. Fetching recommendations...")
try:
    headers = {"Authorization": f"Bearer {token}"}
    rec_response = requests.get(
        "http://localhost:8000/stats/recommendations",
        headers=headers
    )
    
    if rec_response.status_code == 200:
        data = rec_response.json()
        print("✅ Recommendations fetched!")
        print(f"   Source: {data.get('source')}")
        print(f"   Message: {data.get('message')}")
        print(f"   Count: {len(data.get('recommendations', []))} songs")
        
        # Show first 3 songs
        print("\n📀 Sample Songs:")
        for i, song in enumerate(data.get('recommendations', [])[:3], 1):
            print(f"   {i}. {song['title']}")
            print(f"      Artist: {song['channel']}")
            print(f"      ID: {song['youtube_video_id']}")
            print()
    else:
        print(f"❌ Failed: {rec_response.status_code}")
        print(f"   Response: {rec_response.text}")
except Exception as e:
    print(f"❌ Error: {e}")

print("=" * 50)
print("✅ Test complete!")
