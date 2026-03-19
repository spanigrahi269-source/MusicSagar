"""
Check YouTube API quota for all configured keys
"""
import requests
import os
from dotenv import load_dotenv

load_dotenv()
load_dotenv('backend/.env')

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

# Get all API keys
api_keys = {
    "Key 1 (Primary)": os.getenv('YOUTUBE_API_KEY_1'),
    "Key 2 (Backup)": os.getenv('YOUTUBE_API_KEY_2'),
    "Key 3 (Backup)": os.getenv('YOUTUBE_API_KEY_3'),
    "Key 4 (Backup)": os.getenv('YOUTUBE_API_KEY_4'),
    "Key 5 (Backup)": os.getenv('YOUTUBE_API_KEY_5'),
    "Key 6 (Backup)": os.getenv('YOUTUBE_API_KEY_6'),
    "Key 7 (Backup)": os.getenv('YOUTUBE_API_KEY_7'),
    "Key 8 (Backup)": os.getenv('YOUTUBE_API_KEY_8'),
    "Key 9 (Backup)": os.getenv('YOUTUBE_API_KEY_9'),
    "Key 10 (Backup)": os.getenv('YOUTUBE_API_KEY_10'),
    "Key 11 (Backup)": os.getenv('YOUTUBE_API_KEY_11'),
    "Key 12 (Backup)": os.getenv('YOUTUBE_API_KEY_12'),
    "Key 13 (Backup)": os.getenv('YOUTUBE_API_KEY_13'),
    "Key 14 (Backup)": os.getenv('YOUTUBE_API_KEY_14'),
    "Key 15 (Backup)": os.getenv('YOUTUBE_API_KEY_15'),
    "Key 16 (Backup)": os.getenv('YOUTUBE_API_KEY_16'),
    "Key 17 (Backup)": os.getenv('YOUTUBE_API_KEY_17'),
    "Key 18 (Backup)": os.getenv('YOUTUBE_API_KEY_18'),
    "Key 19 (Backup)": os.getenv('YOUTUBE_API_KEY_19'),
    "Key 20 (Backup)": os.getenv('YOUTUBE_API_KEY_20'),
    "Key 21 (Backup)": os.getenv('YOUTUBE_API_KEY_21'),
    "Key 22 (Backup)": os.getenv('YOUTUBE_API_KEY_22'),
    "Key 23 (Backup)": os.getenv('YOUTUBE_API_KEY_23'),
    "Key 24 (Backup)": os.getenv('YOUTUBE_API_KEY_24'),
    "Key 25 (Backup)": os.getenv('YOUTUBE_API_KEY_25'),
    "Key 26 (Backup)": os.getenv('YOUTUBE_API_KEY_26'),
    "Key 27 (Backup)": os.getenv('YOUTUBE_API_KEY_27'),
    "Key 28 (Backup)": os.getenv('YOUTUBE_API_KEY_28'),
    "Key 29 (Backup)": os.getenv('YOUTUBE_API_KEY_29'),
    "Key 30 (Backup)": os.getenv('YOUTUBE_API_KEY_30'),
}

print("\n" + "="*80)
print("YOUTUBE API QUOTA CHECK")
print("="*80)
print("\nTesting all configured API keys...\n")

working_keys = 0
quota_exceeded_keys = 0

for name, key in api_keys.items():
    if not key:
        print(f"❌ {name}: Not configured")
        continue
    
    # Test with a simple search
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
            print(f"✅ {name}: Working")
            print(f"   Key: {key[:20]}...{key[-10:]}")
            working_keys += 1
        elif response.status_code == 403:
            error_data = response.json()
            error_reason = error_data.get('error', {}).get('errors', [{}])[0].get('reason', 'unknown')
            
            if 'quota' in error_reason.lower():
                print(f"⚠️  {name}: Quota Exceeded")
                print(f"   Key: {key[:20]}...{key[-10:]}")
                print(f"   Will reset at midnight Pacific Time")
                quota_exceeded_keys += 1
            else:
                print(f"❌ {name}: Error - {error_reason}")
                print(f"   Key: {key[:20]}...{key[-10:]}")
        else:
            print(f"❌ {name}: HTTP {response.status_code}")
            print(f"   Key: {key[:20]}...{key[-10:]}")
    
    except Exception as e:
        print(f"❌ {name}: Connection error - {e}")

print("\n" + "="*80)
print("SUMMARY")
print("="*80)
print(f"\n✅ Working Keys: {working_keys}")
print(f"⚠️  Quota Exceeded: {quota_exceeded_keys}")
print(f"❌ Invalid/Error: {len(api_keys) - working_keys - quota_exceeded_keys}")

print("\n" + "="*80)
print("QUOTA INFORMATION")
print("="*80)
print("\nYouTube Data API v3 Quota:")
print("  • Daily Limit: 10,000 units per key")
print("  • Search Cost: 100 units per search")
print("  • Video Details: 1 unit per request")
print("\nWith your keys:")
print(f"  • Working Keys: {working_keys}")
print(f"  • Available Searches Today: ~{working_keys * 100} searches")
print(f"  • Total Daily Capacity: ~{len(api_keys) * 100} searches (when all keys reset)")

print("\n💡 Tips:")
print("  • Quota resets at midnight Pacific Time (PST/PDT)")
print("  • Each search uses 100 units")
print("  • Fetching video durations uses 1 unit per 50 videos")
print("  • Your app automatically rotates between working keys")
print(f"  • You now have {len(api_keys)} API keys configured")

print("\n")
