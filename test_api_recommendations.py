"""
Test what the recommendations API is actually returning
"""
import requests

# Test the recommendations endpoint
try:
    # First login to get token
    login_response = requests.post(
        'http://localhost:8000/auth/login',
        json={
            'email': 'sagar@example.com',
            'password': 'Sagar@269'
        }
    )
    
    if login_response.status_code == 200:
        token = login_response.json()['access_token']
        print("✅ Login successful")
        
        # Get recommendations
        headers = {'Authorization': f'Bearer {token}'}
        recs_response = requests.get(
            'http://localhost:8000/stats/recommendations',
            headers=headers
        )
        
        if recs_response.status_code == 200:
            data = recs_response.json()
            print(f"\n📊 Recommendations API Response:")
            print(f"Total: {data.get('total', 0)}")
            print(f"Message: {data.get('message', 'N/A')}")
            print(f"Source: {data.get('source', 'N/A')}")
            print(f"Number of songs: {len(data.get('recommendations', []))}")
            
            if data.get('recommendations'):
                print(f"\n🎵 First 3 songs:")
                for i, song in enumerate(data['recommendations'][:3], 1):
                    print(f"  {i}. {song['title']} - {song['channel']}")
            else:
                print("\n✅ No songs returned (database is empty)")
        else:
            print(f"❌ Recommendations API error: {recs_response.status_code}")
            print(recs_response.text)
    else:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nMake sure backend is running on http://localhost:8000")
