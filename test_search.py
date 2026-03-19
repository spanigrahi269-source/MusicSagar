import requests

try:
    response = requests.get('http://localhost:8000/youtube/search?query=test', timeout=10)
    print(f'Status Code: {response.status_code}')
    
    if response.status_code == 200:
        data = response.json()
        print(f'Results found: {len(data.get("results", []))}')
        print('✅ Search endpoint is working!')
    else:
        print(f'❌ Error: {response.text}')
except Exception as e:
    print(f'❌ Failed to connect: {e}')
