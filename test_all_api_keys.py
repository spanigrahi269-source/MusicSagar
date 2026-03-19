#!/usr/bin/env python3
"""
Test all 30 YouTube API keys to verify they're working
"""
import os
import asyncio
import httpx
from dotenv import load_dotenv

# Load environment variables
load_dotenv('backend/.env')

YOUTUBE_SEARCH_URL = "https://www.googleapis.com/youtube/v3/search"

async def test_api_key(key_number: int, api_key: str):
    """Test a single API key"""
    if not api_key:
        return key_number, "MISSING", "No API key found"
    
    params = {
        "part": "snippet",
        "q": "test music",
        "type": "video",
        "maxResults": 1,
        "key": api_key
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(YOUTUBE_SEARCH_URL, params=params)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("items"):
                    return key_number, "WORKING", f"✅ Found {len(data['items'])} results"
                else:
                    return key_number, "NO_RESULTS", "⚠️ No results returned"
            elif response.status_code == 403:
                error_data = response.json()
                error_reason = error_data.get('error', {}).get('errors', [{}])[0].get('reason', 'unknown')
                if 'quota' in error_reason.lower():
                    return key_number, "QUOTA_EXCEEDED", "❌ Quota exceeded"
                else:
                    return key_number, "FORBIDDEN", f"❌ Forbidden: {error_reason}"
            else:
                return key_number, "ERROR", f"❌ HTTP {response.status_code}"
                
    except Exception as e:
        return key_number, "EXCEPTION", f"❌ Exception: {str(e)}"

async def test_all_keys():
    """Test all API keys concurrently"""
    print("🔍 Testing all 30 YouTube API keys...")
    print("=" * 80)
    
    tasks = []
    for i in range(1, 31):
        key_name = f"YOUTUBE_API_KEY_{i}"
        api_key = os.getenv(key_name)
        tasks.append(test_api_key(i, api_key))
    
    # Run all tests concurrently
    results = await asyncio.gather(*tasks)
    
    # Sort results by key number
    results.sort(key=lambda x: x[0])
    
    # Display results
    working_count = 0
    quota_exceeded_count = 0
    error_count = 0
    
    for key_num, status, message in results:
        key_name = f"YOUTUBE_API_KEY_{key_num}"
        api_key = os.getenv(key_name)
        
        if api_key:
            key_display = f"{api_key[:20]}...{api_key[-4:]}"
        else:
            key_display = "NOT SET"
        
        print(f"Key {key_num:2d}: {key_display} | {status:15s} | {message}")
        
        if status == "WORKING":
            working_count += 1
        elif status == "QUOTA_EXCEEDED":
            quota_exceeded_count += 1
        else:
            error_count += 1
    
    print("=" * 80)
    print(f"📊 SUMMARY:")
    print(f"   ✅ Working keys: {working_count}/30")
    print(f"   ⚠️  Quota exceeded: {quota_exceeded_count}/30")
    print(f"   ❌ Error/Missing: {error_count}/30")
    
    if working_count > 0:
        daily_quota = working_count * 10000
        print(f"   🎯 Total daily quota: {daily_quota:,} units")
        print(f"   🔍 Estimated searches: {daily_quota // 100:,} searches/day")
        print(f"   👥 Supports users: {daily_quota // 1000:,}+ users/day")
    
    print("=" * 80)
    
    if working_count >= 30:
        print("🚀 INCREDIBLE! You have massive API capacity!")
    elif working_count >= 20:
        print("🎉 EXCELLENT! You have plenty of working API keys!")
    elif working_count >= 10:
        print("✅ GOOD! You have enough working API keys for normal usage.")
    elif working_count >= 5:
        print("⚠️  WARNING! Limited API keys. Consider getting more.")
    else:
        print("❌ CRITICAL! Very few working API keys. Get more immediately!")

if __name__ == "__main__":
    asyncio.run(test_all_keys())