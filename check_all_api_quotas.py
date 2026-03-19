import os
from dotenv import load_dotenv
from googleapiclient.discovery import build
from datetime import datetime

# Load environment variables
load_dotenv('backend/.env')

def check_quota_for_key(api_key, key_number):
    """Check if an API key is working by making a minimal quota request"""
    try:
        youtube = build('youtube', 'v3', developerKey=api_key)
        
        # Make a minimal request (costs 1 quota unit)
        request = youtube.search().list(
            part='snippet',
            q='test',
            maxResults=1,
            type='video'
        )
        response = request.execute()
        
        return {
            'key_number': key_number,
            'status': '✅ WORKING',
            'quota_used': '1 unit (test)',
            'error': None
        }
    except Exception as e:
        error_msg = str(e)
        if 'quotaExceeded' in error_msg:
            return {
                'key_number': key_number,
                'status': '❌ QUOTA EXCEEDED',
                'quota_used': '10,000/10,000',
                'error': 'Daily quota exhausted'
            }
        elif 'invalid' in error_msg.lower() or 'API key not valid' in error_msg:
            return {
                'key_number': key_number,
                'status': '❌ INVALID KEY',
                'quota_used': 'N/A',
                'error': 'API key is invalid or disabled'
            }
        else:
            return {
                'key_number': key_number,
                'status': '⚠️ ERROR',
                'quota_used': 'Unknown',
                'error': error_msg[:100]
            }

def main():
    print("=" * 80)
    print("YOUTUBE API QUOTA CHECK - MARCH 2026")
    print(f"Checked on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    print()
    
    working_keys = []
    quota_exceeded_keys = []
    invalid_keys = []
    error_keys = []
    
    # Check all 30 keys
    for i in range(1, 31):
        key_name = f'YOUTUBE_API_KEY_{i}'
        api_key = os.getenv(key_name)
        
        if not api_key:
            print(f"Key {i:2d}: ⚠️  NOT CONFIGURED")
            continue
        
        print(f"Checking Key {i:2d}...", end=' ')
        result = check_quota_for_key(api_key, i)
        print(result['status'])
        
        if result['status'] == '✅ WORKING':
            working_keys.append(result)
        elif result['status'] == '❌ QUOTA EXCEEDED':
            quota_exceeded_keys.append(result)
        elif result['status'] == '❌ INVALID KEY':
            invalid_keys.append(result)
        else:
            error_keys.append(result)
    
    # Summary
    print()
    print("=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"✅ Working Keys:        {len(working_keys)}")
    print(f"❌ Quota Exceeded:      {len(quota_exceeded_keys)}")
    print(f"❌ Invalid Keys:        {len(invalid_keys)}")
    print(f"⚠️  Error Keys:          {len(error_keys)}")
    print(f"📊 Total Keys Checked:  {len(working_keys) + len(quota_exceeded_keys) + len(invalid_keys) + len(error_keys)}")
    print()
    
    # Available quota estimation
    if working_keys:
        print("=" * 80)
        print("AVAILABLE QUOTA ESTIMATION")
        print("=" * 80)
        print(f"Working keys: {len(working_keys)}")
        print(f"Quota per key: 10,000 units/day")
        print(f"Total available: {len(working_keys) * 10000:,} units/day")
        print()
        print("Quota costs:")
        print("  - Search: 100 units per request")
        print("  - Video details: 1 unit per request")
        print("  - Channel details: 1 unit per request")
        print()
        print(f"Estimated searches available today: ~{len(working_keys) * 100} searches")
        print()
    
    # Details of problematic keys
    if quota_exceeded_keys:
        print("=" * 80)
        print("QUOTA EXCEEDED KEYS (Reset at midnight Pacific Time)")
        print("=" * 80)
        for key in quota_exceeded_keys:
            print(f"  Key {key['key_number']:2d}: {key['error']}")
        print()
    
    if invalid_keys:
        print("=" * 80)
        print("INVALID KEYS (Need to be replaced)")
        print("=" * 80)
        for key in invalid_keys:
            print(f"  Key {key['key_number']:2d}: {key['error']}")
        print()
    
    if error_keys:
        print("=" * 80)
        print("ERROR KEYS (Check details)")
        print("=" * 80)
        for key in error_keys:
            print(f"  Key {key['key_number']:2d}: {key['error']}")
        print()
    
    # Recommendations
    print("=" * 80)
    print("RECOMMENDATIONS")
    print("=" * 80)
    if len(working_keys) >= 20:
        print("✅ You have plenty of API quota available!")
        print("   Your app should work smoothly with current usage.")
    elif len(working_keys) >= 10:
        print("⚠️  You have moderate API quota available.")
        print("   Monitor usage and consider getting more keys if needed.")
    elif len(working_keys) >= 5:
        print("⚠️  Low API quota available.")
        print("   Consider getting more API keys to avoid service interruption.")
    else:
        print("❌ Critical: Very few working API keys!")
        print("   Get more API keys immediately to ensure service availability.")
    
    if quota_exceeded_keys:
        print(f"\n💡 {len(quota_exceeded_keys)} keys will reset at midnight Pacific Time")
    
    if invalid_keys:
        print(f"\n⚠️  {len(invalid_keys)} invalid keys need to be replaced")
        print("   Visit: https://console.cloud.google.com/apis/credentials")

if __name__ == '__main__':
    main()
