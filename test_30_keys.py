"""Quick test of all 30 YouTube API keys"""
import requests
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

print("\n" + "="*60)
print("TESTING 30 YOUTUBE API KEYS")
print("="*60 + "\n")

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

working = 0
quota_exceeded = 0
errors = 0

for i in range(1, 31):
    key_name = f'YOUTUBE_API_KEY_{i}'
    key = os.getenv(key_name)
    
    if not key:
        print(f"❌ Key {i}: Not found")
        errors += 1
        continue
    
    params = {
        "part": "snippet",
        "q": "test",
        "type": "video",
        "maxResults": 1,
        "key": key
    }
    
    try:
        response = requests.get(YOUTUBE_SEARCH_URL, params=params, timeout=5)
        
        if response.status_code == 200:
            print(f"✅ Key {i}: Working")
            working += 1
        elif response.status_code == 403:
            error_data = response.json()
            reason = error_data.get('error', {}).get('errors', [{}])[0].get('reason', '')
            if 'quota' in reason.lower():
                print(f"⚠️  Key {i}: Quota Exceeded")
                quota_exceeded += 1
            else:
                print(f"❌ Key {i}: Error - {reason}")
                errors += 1
        else:
            print(f"❌ Key {i}: HTTP {response.status_code}")
            errors += 1
    except Exception as e:
        print(f"❌ Key {i}: {str(e)[:50]}")
        errors += 1

print("\n" + "="*60)
print("SUMMARY")
print("="*60)
print(f"✅ Working: {working}")
print(f"⚠️  Quota Exceeded: {quota_exceeded}")
print(f"❌ Errors: {errors}")
print(f"\n📊 Available Searches: ~{working * 100} searches")
print(f"📊 Total Capacity (after reset): ~{30 * 100} = 3,000 searches/day")
print("\n")
