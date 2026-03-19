"""
Test script to verify the image proxy is working
"""
import requests

# Test the proxy endpoint
proxy_url = "http://localhost:8000/proxy/image"
test_image_url = "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg"

print("Testing image proxy...")
print(f"Proxy URL: {proxy_url}")
print(f"Test image: {test_image_url}")
print()

try:
    response = requests.get(f"{proxy_url}?url={test_image_url}", timeout=10)
    
    if response.status_code == 200:
        print("✅ SUCCESS! Proxy is working")
        print(f"   Status: {response.status_code}")
        print(f"   Content-Type: {response.headers.get('content-type')}")
        print(f"   Content-Length: {len(response.content)} bytes")
    else:
        print(f"❌ FAILED with status {response.status_code}")
        print(f"   Response: {response.text}")
except requests.exceptions.ConnectionError:
    print("❌ ERROR: Cannot connect to backend")
    print("   Make sure the backend server is running on port 8000")
except Exception as e:
    print(f"❌ ERROR: {e}")
