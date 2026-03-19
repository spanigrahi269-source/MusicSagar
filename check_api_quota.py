#!/usr/bin/env python3
"""
Check YouTube API quota usage for all keys
Run this daily to monitor your API usage
"""
import os
import requests
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('backend/.env')

def check_key_quota(key_number, api_key):
    """Check if an API key is working (has quota remaining)"""
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": "test",
        "type": "video",
        "maxResults": 1,
        "key": api_key
    }
    
    try:
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code == 200:
            return "✅ WORKING", "Has quota remaining"
        elif response.status_code == 403:
            error = response.json().get('error', {})
            reason = error.get('errors', [{}])[0].get('reason', '')
            if 'quota' in reason.lower():
                return "❌ QUOTA EXCEEDED", "Daily limit reached"
            else:
                return "⚠️ ERROR", f"Forbidden: {reason}"
        else:
            return "⚠️ ERROR", f"HTTP {response.status_code}"
    except Exception as e:
        return "❌ FAILED", str(e)

def main():
    print("=" * 70)
    print(f"📊 YouTube API Quota Check - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
    working = 0
    quota_exceeded = 0
    errors = 0
    
    for i in range(1, 31):
        key_name = f"YOUTUBE_API_KEY_{i}"
        api_key = os.getenv(key_name)
        
        if not api_key:
            print(f"Key {i:2d}: NOT CONFIGURED")
            errors += 1
            continue
        
        status, message = check_key_quota(i, api_key)
        key_display = f"{api_key[:15]}...{api_key[-4:]}"
        print(f"Key {i:2d}: {key_display} | {status} | {message}")
        
        if "WORKING" in status:
            working += 1
        elif "QUOTA" in status:
            quota_exceeded += 1
        else:
            errors += 1
    
    print("=" * 70)
    print(f"📈 SUMMARY:")
    print(f"   ✅ Working (has quota): {working}/30")
    print(f"   ❌ Quota exceeded: {quota_exceeded}/30")
    print(f"   ⚠️  Errors/Not configured: {errors}/30")
    print()
    
    if working > 0:
        remaining_quota = working * 10000
        remaining_searches = working * 100
        print(f"   🎯 Remaining daily quota: {remaining_quota:,} units")
        print(f"   🔍 Remaining searches today: {remaining_searches:,} searches")
    
    print("=" * 70)
    
    if quota_exceeded > 0:
        print(f"⏰ {quota_exceeded} keys exhausted. Quota resets at midnight Pacific Time.")
    
    if working >= 30:
        print("🚀 EXCELLENT! Most keys still have quota!")
    elif working >= 20:
        print("✅ GOOD! Plenty of quota remaining!")
    elif working >= 10:
        print("⚠️  MODERATE! Half quota used!")
    elif working > 0:
        print("⚠️  LOW! Most quota used!")
    else:
        print("❌ ALL QUOTA EXHAUSTED! Wait for midnight PT reset!")

if __name__ == "__main__":
    main()
