"""Test backend search endpoint right now"""
import requests

print("\nTesting backend at http://localhost:8000/youtube/search\n")

try:
    response = requests.get(
        "http://localhost:8000/youtube/search",
        params={"query": "test"},
        timeout=15
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ SUCCESS! Found {len(data.get('results', []))} results")
    elif response.status_code == 429:
        print("⚠️  All API keys quota exceeded")
    else:
        print(f"Response: {response.text[:500]}")
        
except Exception as e:
    print(f"❌ Error: {e}")
