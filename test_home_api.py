import requests

# Test the recommendations endpoint
try:
    # Login first
    login_response = requests.post(
        'http://localhost:8000/auth/login',
        json={'email': 'sagar@example.com', 'password': 'Sagar@269'}
    )
    
    if login_response.status_code == 200:
        token = login_response.json()['access_token']
        print(f"✅ Login successful")
        
        # Get recommendations
        headers = {'Authorization': f'Bearer {token}'}
        recs_response = requests.get(
            'http://localhost:8000/stats/recommendations',
            headers=headers
        )
        
        if recs_response.status_code == 200:
            data = recs_response.json()
            print(f"✅ Recommendations API working")
            print(f"   Total recommendations: {len(data.get('recommendations', []))}")
            print(f"   Message: {data.get('message', 'N/A')}")
            print(f"   Source: {data.get('source', 'N/A')}")
            
            if len(data.get('recommendations', [])) > 0:
                print(f"\n   First 3 songs:")
                for i, song in enumerate(data['recommendations'][:3], 1):
                    print(f"   {i}. {song['title'][:60]}")
        else:
            print(f"❌ Recommendations API failed: {recs_response.status_code}")
            print(f"   Error: {recs_response.text}")
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        print(f"   Error: {login_response.text}")

except Exception as e:
    print(f"❌ Error: {e}")
