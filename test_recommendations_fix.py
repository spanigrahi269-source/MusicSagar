import requests
import json

# Test credentials
email = "sagar@example.com"
password = "Sagar@269"

# Login to get token
print("🔐 Logging in...")
login_response = requests.post(
    "http://127.0.0.1:8000/auth/login",
    json={"email": email, "password": password}
)

if login_response.status_code == 200:
    token = login_response.json()["access_token"]
    print(f"✅ Login successful! Token: {token[:20]}...")
    
    # Get recommendations
    print("\n🎵 Fetching recommendations...")
    headers = {"Authorization": f"Bearer {token}"}
    recs_response = requests.get(
        "http://127.0.0.1:8000/stats/recommendations",
        headers=headers
    )
    
    if recs_response.status_code == 200:
        data = recs_response.json()
        recommendations = data.get("recommendations", [])
        source = data.get("source", "unknown")
        message = data.get("message", "")
        
        print(f"\n✅ Got {len(recommendations)} recommendations")
        print(f"📊 Source: {source}")
        print(f"💬 Message: {message}")
        
        if len(recommendations) >= 12:
            print(f"\n🎉 SUCCESS! Got {len(recommendations)} songs (minimum 12 required)")
        else:
            print(f"\n⚠️ WARNING! Only got {len(recommendations)} songs (need 12)")
        
        print("\n📝 First 3 songs:")
        for i, song in enumerate(recommendations[:3], 1):
            print(f"  {i}. {song['title'][:50]}... by {song['channel']}")
    else:
        print(f"❌ Failed to get recommendations: {recs_response.status_code}")
        print(recs_response.text)
else:
    print(f"❌ Login failed: {login_response.status_code}")
    print(login_response.text)
