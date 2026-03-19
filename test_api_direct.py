"""Test the API directly to see the actual error"""
import requests
import json

print("\nTesting search API directly...\n")

try:
    response = requests.get(
        "http://localhost:8000/youtube/search",
        params={"query": "test"},
        timeout=10
    )
    
    print(f"Status Code: {response.status_code}\n")
    
    if response.status_code == 500:
        print("500 Internal Server Error")
        print("\nResponse body:")
        try:
            error_data = response.json()
            print(json.dumps(error_data, indent=2))
        except:
            print(response.text)
    elif response.status_code == 200:
        print("✅ SUCCESS!")
        data = response.json()
        print(f"Found {len(data.get('results', []))} results")
    else:
        print(f"Status: {response.status_code}")
        print(response.text)
        
except requests.exceptions.ConnectionError:
    print("❌ Backend is not running!")
    print("Start it with: cd backend && .venv\\Scripts\\activate && uvicorn app.main:app --reload --port 8000")
except Exception as e:
    print(f"❌ Error: {e}")
