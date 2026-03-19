"""
Diagnose YouTube API issues
"""
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
load_dotenv('backend/.env')

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

print("\n" + "="*80)
print("YOUTUBE API DIAGNOSTICS")
print("="*80 + "\n")

# Check if API key exists
if not YOUTUBE_API_KEY:
    print("❌ YouTube API key not found!")
    print("\nPlease set YOUTUBE_API_KEY in .env or backend/.env")
    exit(1)

print(f"✅ API Key found: {YOUTUBE_API_KEY[:20]}...")

# Test 1: Simple search (no filters)
print("\n" + "-"*80)
print("TEST 1: Simple Search (no filters)")
print("-"*80)

url = "https://www.googleapis.com/youtube/v3/search"
params = {
    "part": "snippet",
    "q": "music",
    "type": "video",
    "maxResults": 5,
    "key": YOUTUBE_API_KEY
}

try:
    response = requests.get(url, params=params, timeout=10)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ SUCCESS! Found {len(data.get('items', []))} results")
        if data.get('items'):
            print(f"\nFirst result: {data['items'][0]['snippet']['title']}")
    elif response.status_code == 403:
        print(f"❌ 403 FORBIDDEN")
        error_data = response.json()
        print(f"\nError details:")
        print(f"  {error_data}")
        print(f"\nPossible causes:")
        print(f"  1. API key quota exceeded (10,000 units/day)")
        print(f"  2. API key doesn't have YouTube Data API v3 enabled")
        print(f"  3. API key has restrictions (IP, referrer, etc.)")
        print(f"\nSolutions:")
        print(f"  1. Wait 24 hours for quota to reset")
        print(f"  2. Get a new API key from Google Cloud Console")
        print(f"  3. Check API key restrictions in Google Cloud Console")
    else:
        print(f"❌ Error: {response.status_code}")
        print(f"Response: {response.text}")
except Exception as e:
    print(f"❌ Exception: {e}")

# Test 2: With music category filter
print("\n" + "-"*80)
print("TEST 2: With Music Category Filter")
print("-"*80)

params["videoCategoryId"] = "10"

try:
    response = requests.get(url, params=params, timeout=10)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ SUCCESS! Music category filter works")
    elif response.status_code == 403:
        print(f"❌ 403 FORBIDDEN - Music category filter might be restricted")
    else:
        print(f"❌ Error: {response.status_code}")
except Exception as e:
    print(f"❌ Exception: {e}")

# Test 3: Check quota
print("\n" + "-"*80)
print("QUOTA INFORMATION")
print("-"*80)
print(f"\nYouTube Data API v3 Quota:")
print(f"  - Default: 10,000 units/day")
print(f"  - Search costs: 100 units per request")
print(f"  - Video details: 1 unit per request")
print(f"  - Max searches per day: ~100")
print(f"\nTo check your quota:")
print(f"  1. Go to: https://console.cloud.google.com/")
print(f"  2. Select your project")
print(f"  3. Go to: APIs & Services > Dashboard")
print(f"  4. Click on YouTube Data API v3")
print(f"  5. Check 'Quotas' tab")

print("\n" + "="*80)
print("DIAGNOSTICS COMPLETE")
print("="*80 + "\n")
