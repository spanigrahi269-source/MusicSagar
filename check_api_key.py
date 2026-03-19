import os
from dotenv import load_dotenv

# Load from root .env
load_dotenv()
print(f"Root .env API Key: {os.getenv('YOUTUBE_API_KEY')}")

# Load from backend/.env
load_dotenv('backend/.env')
print(f"Backend .env API Key: {os.getenv('YOUTUBE_API_KEY')}")

# Check all API keys
for i in range(1, 5):
    key = os.getenv(f'YOUTUBE_API_KEY_{i}')
    if key:
        print(f"API Key {i}: {key}")
