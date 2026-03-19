"""Test if environment variables are loading correctly"""
import os
from dotenv import load_dotenv

# Load from backend/.env
load_dotenv('backend/.env')

print("\nChecking if API keys are loaded...\n")

keys_found = 0
for i in range(1, 31):
    key_name = f'YOUTUBE_API_KEY_{i}'
    key_value = os.getenv(key_name)
    
    if key_value:
        keys_found += 1
        print(f"✅ {key_name}: {key_value[:20]}...{key_value[-10:]}")
    else:
        print(f"❌ {key_name}: NOT FOUND")
        if i <= 5:  # Only show first 5 missing
            break

print(f"\nTotal keys found: {keys_found}/30\n")

if keys_found == 0:
    print("⚠️  NO KEYS FOUND!")
    print("The backend can't find the API keys in backend/.env")
elif keys_found < 30:
    print(f"⚠️  Only {keys_found} keys found, expected 30")
else:
    print("✅ All 30 keys are loaded correctly!")
