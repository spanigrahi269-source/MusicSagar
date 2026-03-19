"""Test login with the created user"""
import requests
import json

API_URL = "http://localhost:8000"

print("=" * 60)
print("Testing Login for Music Sagar")
print("=" * 60)

# Test data
login_data = {
    "email": "sagar@example.com",
    "password": "Sagar@269"
}

print("\nAttempting to login...")
print(f"Email: {login_data['email']}")
print(f"Password: {'*' * len(login_data['password'])}")

try:
    response = requests.post(
        f"{API_URL}/auth/login",
        json=login_data,
        timeout=5
    )
    
    print(f"\nStatus Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("\n✅ Login Successful!")
        print(f"\nUser Info:")
        print(f"  ID: {data['user']['id']}")
        print(f"  Username: {data['user']['username']}")
        print(f"  Email: {data['user']['email']}")
        print(f"\nToken: {data['access_token'][:50]}...")
    else:
        print(f"\n❌ Login Failed!")
        print(f"Response: {response.text}")
        
except requests.exceptions.ConnectionError:
    print("\n⚠️  Backend server is not running!")
    print("Please start the backend server first:")
    print("  cd backend")
    print("  uvicorn app.main:app --reload")
    
except Exception as e:
    print(f"\n❌ Error: {e}")

print("=" * 60)
