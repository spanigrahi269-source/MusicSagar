import sys
sys.path.insert(0, 'backend')

import os
from app.database import get_db
from googleapiclient.discovery import build
from datetime import datetime

# Read .env file manually
env_path = 'backend/.env'
api_keys = {}

print("Reading API keys from backend/.env...")
with open(env_path, 'r') as f:
    for line in f:
        line = line.strip()
        if line.startswith('YOUTUBE_API_KEY_'):
            key, value = line.split('=', 1)
            api_keys[key] = value.strip().strip('"').strip("'")

print(f"Found {len(api_keys)} API keys configured\n")

def check_quota_for_key(api_key, key_number):
    """Check if an API key is working"""
    try:
        youtube = build('youtube', 'v3', developerKey=api_key)
        
        # Make a minimal request (costs 1 quota unit)
        request = youtube.search().list(
            part='snippet',
            q='music',
            maxResults=1,
            type='video'
        )
        response = request.execute()
        
        return {
            'key_number': key_number,
            'status': '✅ WORKING',
            'error': None
        }
    except Exception as e:
        error_msg = str(e)
        if 'quotaExceeded' in error_msg:
            return {
                'key_number': key_number,
                'status': '❌ QUOTA EXCEEDED',
                'error': 'Daily quota exhausted'
            }
        elif 'invalid' in error_msg.lower() or 'API key not valid' in error_msg:
            return {
                'key_number': key_number,
                'status': '❌ INVALID',
                'error': 'Invalid or disabled'
            }
        else:
            return {
                'key_number': key_number,
                'status': '⚠️ ERROR',
                'error': error_msg[:80]
            }

print("=" * 80)
print("YOUTUBE API QUOTA CHECK - MARCH 2026")
print(f"Checked on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print("=" * 80)
print()

working_keys = []
quota_exceeded_keys = []
invalid_keys = []
error_keys = []

# Check all keys
for i in range(1, 31):
    key_name = f'YOUTUBE_API_KEY_{i}'
    api_key = api_keys.get(key_name)
    
    if not api_key:
        continue
    
    print(f"Checking Key {i:2d}...", end=' ', flush=True)
    result = check_quota_for_key(api_key, i)
    print(result['status'])
    
    if result['status'] == '✅ WORKING':
        working_keys.append(result)
    elif result['status'] == '❌ QUOTA EXCEEDED':
        quota_exceeded_keys.append(result)
    elif result['status'] == '❌ INVALID':
        invalid_keys.append(result)
    else:
        error_keys.append(result)

# Summary
print()
print("=" * 80)
print("SUMMARY")
print("=" * 80)
print(f"✅ Working Keys:        {len(working_keys)}")
print(f"❌ Quota Exceeded:      {len(quota_exceeded_keys)}")
print(f"❌ Invalid Keys:        {len(invalid_keys)}")
print(f"⚠️  Error Keys:          {len(error_keys)}")
print(f"📊 Total Keys Checked:  {len(working_keys) + len(quota_exceeded_keys) + len(invalid_keys) + len(error_keys)}")
print()

# Available quota estimation
if working_keys:
    print("=" * 80)
    print("AVAILABLE QUOTA TODAY")
    print("=" * 80)
    print(f"Working keys: {len(working_keys)}")
    print(f"Quota per key: 10,000 units/day")
    print(f"Total available: {len(working_keys) * 10000:,} units/day")
    print()
    print("Quota costs:")
    print("  - Search: 100 units per request")
    print("  - Video details: 1 unit per request")
    print()
    print(f"Estimated searches available today: ~{len(working_keys) * 100} searches")
    print()

# Details
if quota_exceeded_keys:
    print("=" * 80)
    print("QUOTA EXCEEDED KEYS")
    print("=" * 80)
    for key in quota_exceeded_keys:
        print(f"  Key {key['key_number']:2d}: Will reset at midnight Pacific Time")
    print()

if invalid_keys:
    print("=" * 80)
    print("INVALID KEYS (Need replacement)")
    print("=" * 80)
    for key in invalid_keys:
        print(f"  Key {key['key_number']:2d}: {key['error']}")
    print()

# Recommendations
print("=" * 80)
print("RECOMMENDATIONS")
print("=" * 80)
if len(working_keys) >= 20:
    print("✅ Excellent! You have plenty of API quota available.")
    print("   Your app can handle heavy usage today.")
elif len(working_keys) >= 10:
    print("✅ Good! You have sufficient API quota.")
    print("   Monitor usage if you expect heavy traffic.")
elif len(working_keys) >= 5:
    print("⚠️  Moderate quota available.")
    print("   Consider getting more keys if usage increases.")
else:
    print("❌ Low quota! Get more API keys to ensure availability.")

if quota_exceeded_keys:
    print(f"\n💡 {len(quota_exceeded_keys)} keys will reset at midnight Pacific Time")
    print("   That will add", len(quota_exceeded_keys) * 10000, "more quota units")

print("\n" + "=" * 80)
