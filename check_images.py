"""
Quick script to check if YouTube images are accessible
"""
import requests

# Test URLs from your database
test_urls = [
    "https://i.ytimg.com/vi/kJa2kwoZ2a4/mqdefault.jpg",  # Kesariya
    "https://i.ytimg.com/vi/RLzC55ai0eo/mqdefault.jpg",  # Apna Bana Le
    "https://i.ytimg.com/vi/IIgJV8WRXQY/mqdefault.jpg",  # Tum Hi Ho
    "https://i.ytimg.com/vi/YGLBK1S8WS8/mqdefault.jpg",  # Chaleya
]

print("Testing YouTube image URLs...")
print("=" * 60)

for i, url in enumerate(test_urls, 1):
    try:
        response = requests.get(url, timeout=5)
        status = "✅ OK" if response.status_code == 200 else f"❌ {response.status_code}"
        print(f"{i}. {status} - {url}")
    except Exception as e:
        print(f"{i}. ❌ ERROR - {url}")
        print(f"   {str(e)}")

print("=" * 60)
print("\nIf all show ❌, YouTube is blocking direct access")
print("If some show ✅, the proxy should work")
