"""Diagnose search functionality issues"""
import requests
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')

print("\n" + "="*70)
print("SEARCH FUNCTIONALITY DIAGNOSTIC")
print("="*70 + "\n")

# Step 1: Check if backend is running
print("1. Checking if backend is running...")
try:
    response = requests.get("http://localhost:8000/docs", timeout=3)
    if response.status_code == 200:
        print("   ✅ Backend is running on port 8000")
    else:
        print(f"   ⚠️  Backend responded with status {response.status_code}")
except Exception as e:
    print(f"   ❌ Backend is NOT running: {e}")
    print("\n   💡 Start backend with: start-local.bat")
    print("="*70 + "\n")
    exit(1)

# Step 2: Check API keys
print("\n2. Checking API keys configuration...")
keys_found = 0
for i in range(1, 31):
    key = os.getenv(f'YOUTUBE_API_KEY_{i}')
    if key:
        keys_found += 1

print(f"   ✅ Found {keys_found} API keys in backend/.env")

# Step 3: Test search endpoint directly
print("\n3. Testing search endpoint...")
try:
    response = requests.get(
        "http://localhost:8000/youtube/search",
        params={"query": "test music"},
        timeout=10
    )
    
    print(f"   Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        results = data.get('results', [])
        print(f"   ✅ Search working! Found {len(results)} results")
        if results:
            print(f"   First result: {results[0].get('title', 'N/A')}")
    elif response.status_code == 429:
        print("   ⚠️  All API keys quota exceeded")
        print("   💡 Keys reset at midnight Pacific Time")
    elif response.status_code == 500:
        error = response.json()
        print(f"   ❌ Server error: {error.get('detail', 'Unknown')}")
    else:
        print(f"   ❌ Unexpected status: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        
except requests.exceptions.Timeout:
    print("   ❌ Request timed out (>10 seconds)")
    print("   💡 This might indicate API quota issues")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Step 4: Test a working API key directly
print("\n4. Testing first API key directly with YouTube...")
first_key = os.getenv('YOUTUBE_API_KEY_1')
if first_key:
    try:
        response = requests.get(
            "https://www.googleapis.com/youtube/v3/search",
            params={
                "part": "snippet",
                "q": "test",
                "type": "video",
                "maxResults": 1,
                "key": first_key
            },
            timeout=5
        )
        
        if response.status_code == 200:
            print("   ✅ Key 1 is working with YouTube API")
        elif response.status_code == 403:
            error_data = response.json()
            reason = error_data.get('error', {}).get('errors', [{}])[0].get('reason', '')
            if 'quota' in reason.lower():
                print("   ⚠️  Key 1 quota exceeded")
            else:
                print(f"   ❌ Key 1 error: {reason}")
        else:
            print(f"   ❌ Key 1 returned status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error testing Key 1: {e}")
else:
    print("   ❌ YOUTUBE_API_KEY_1 not found in .env")

# Step 5: Check frontend
print("\n5. Checking frontend...")
try:
    response = requests.get("http://localhost:5173", timeout=3)
    if response.status_code == 200:
        print("   ✅ Frontend is running on port 5173")
    else:
        print(f"   ⚠️  Frontend responded with status {response.status_code}")
except Exception as e:
    print(f"   ❌ Frontend is NOT running: {e}")
    print("   💡 Start frontend with: cd frontend && npm run dev")

print("\n" + "="*70)
print("DIAGNOSIS COMPLETE")
print("="*70)

print("\n📋 RECOMMENDATIONS:")
print("   1. Make sure backend is running: start-local.bat")
print("   2. Check browser console for errors (F12)")
print("   3. Try clearing browser cache (Ctrl+Shift+Delete)")
print("   4. Check if API keys have quota: python test_30_keys.py")
print("\n")
