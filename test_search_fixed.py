import requests

# Test the search endpoint
try:
    response = requests.get(
        "http://localhost:8000/youtube/search",
        params={"query": "hindi songs"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ Search working! Found {len(data.get('results', []))} results")
        if data.get('results'):
            print(f"First result: {data['results'][0]['title']}")
    else:
        print(f"\n❌ Error: {response.json()}")
        
except Exception as e:
    print(f"❌ Connection error: {e}")
    print("\nMake sure backend is running on http://localhost:8000")
