"""Simple search test - Run this AFTER starting backend"""
import requests
import sys

print("\n" + "="*60)
print("SIMPLE SEARCH TEST")
print("="*60 + "\n")

print("Testing search endpoint at http://localhost:8000/youtube/search\n")

try:
    print("Sending request...")
    response = requests.get(
        "http://localhost:8000/youtube/search",
        params={"query": "hindi songs"},
        timeout=15
    )
    
    print(f"Status Code: {response.status_code}\n")
    
    if response.status_code == 200:
        data = response.json()
        results = data.get('results', [])
        
        print(f"✅ SUCCESS! Found {len(results)} results\n")
        
        if results:
            print("First 3 results:")
            for i, result in enumerate(results[:3], 1):
                print(f"\n{i}. {result.get('title', 'N/A')}")
                print(f"   Channel: {result.get('channelTitle', 'N/A')}")
                print(f"   Video ID: {result.get('videoId', 'N/A')}")
                if result.get('duration'):
                    print(f"   Duration: {result['duration']}")
        
        print(f"\n✅ Search is working properly!")
        
    elif response.status_code == 429:
        print("⚠️  ERROR: All API keys quota exceeded")
        print("\n💡 Solutions:")
        print("   1. Wait for midnight Pacific Time (keys reset)")
        print("   2. Add more API keys")
        print("   3. Check status: python test_30_keys.py")
        
    elif response.status_code == 500:
        error = response.json()
        detail = error.get('detail', 'Unknown error')
        print(f"❌ SERVER ERROR: {detail}")
        
        if "quota" in detail.lower():
            print("\n💡 All API keys have exceeded quota")
            print("   Keys reset at midnight Pacific Time")
        else:
            print("\n💡 Check backend console for detailed error")
            
    else:
        print(f"❌ UNEXPECTED STATUS: {response.status_code}")
        print(f"\nResponse: {response.text[:300]}")
        
except requests.exceptions.ConnectionError:
    print("❌ CONNECTION ERROR: Cannot connect to backend")
    print("\n💡 Backend is not running!")
    print("\nStart backend with:")
    print("   1. Double-click: start-local.bat")
    print("   OR")
    print("   2. Manual: cd backend && .venv\\Scripts\\activate && uvicorn app.main:app --reload --port 8000")
    sys.exit(1)
    
except requests.exceptions.Timeout:
    print("❌ TIMEOUT: Request took longer than 15 seconds")
    print("\n💡 Possible causes:")
    print("   1. API keys are being checked (slow)")
    print("   2. All keys might be quota exceeded")
    print("   3. Network issues")
    
except Exception as e:
    print(f"❌ ERROR: {e}")
    print(f"\nError type: {type(e).__name__}")

print("\n" + "="*60 + "\n")
