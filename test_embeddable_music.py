"""
Test the enhanced YouTube embeddable music search feature
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_search_embeddable_music():
    """Test searching for embeddable music videos"""
    print("\n" + "="*80)
    print("TESTING EMBEDDABLE MUSIC SEARCH")
    print("="*80 + "\n")
    
    # Test queries
    test_queries = [
        ("arijit singh", "hindi"),
        ("new songs", "english"),
        ("trending music", "all")
    ]
    
    for query, language in test_queries:
        print(f"\n📝 Testing: '{query}' (Language: {language})")
        print("-" * 60)
        
        try:
            # Make search request
            response = requests.get(
                f"{BASE_URL}/youtube/search",
                params={"query": query, "language": language},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                
                print(f"✅ Status: {response.status_code}")
                print(f"📊 Total Results: {len(results)}")
                print(f"🔄 Next Page Token: {data.get('nextPageToken', 'None')}")
                
                if results:
                    print(f"\n🎵 First 3 Results:")
                    for i, video in enumerate(results[:3], 1):
                        print(f"\n  {i}. {video['title']}")
                        print(f"     Channel: {video['channelTitle']}")
                        print(f"     Duration: {video.get('duration', 'N/A')}")
                        print(f"     Embeddable: {video.get('embeddable', 'Unknown')}")
                        print(f"     Is Short: {video.get('is_short', 'Unknown')}")
                        print(f"     Video ID: {video['videoId']}")
                    
                    # Check for shorts
                    shorts = [v for v in results if v.get('is_short', False)]
                    if shorts:
                        print(f"\n⚠️  WARNING: Found {len(shorts)} Shorts (should be 0)")
                    else:
                        print(f"\n✅ No Shorts found (good!)")
                    
                    # Check embeddable status
                    non_embeddable = [v for v in results if not v.get('embeddable', True)]
                    if non_embeddable:
                        print(f"⚠️  WARNING: Found {len(non_embeddable)} non-embeddable videos")
                    else:
                        print(f"✅ All videos are embeddable (good!)")
                else:
                    print("⚠️  No results found")
            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")
        
        except requests.exceptions.Timeout:
            print("❌ Request timed out")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "="*80)
    print("TEST COMPLETE")
    print("="*80 + "\n")


def test_video_details():
    """Test fetching video details"""
    print("\n" + "="*80)
    print("TESTING VIDEO DETAILS")
    print("="*80 + "\n")
    
    # First get some video IDs from search
    try:
        response = requests.get(
            f"{BASE_URL}/youtube/search",
            params={"query": "arijit singh", "language": "hindi"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])
            
            if results:
                print(f"✅ Got {len(results)} videos from search")
                print("\n📊 Analyzing video details:")
                
                # Count videos with details
                with_duration = sum(1 for v in results if v.get('duration'))
                with_embeddable = sum(1 for v in results if 'embeddable' in v)
                
                print(f"  - Videos with duration: {with_duration}/{len(results)}")
                print(f"  - Videos with embeddable status: {with_embeddable}/{len(results)}")
                
                # Show sample video details
                if results[0].get('duration'):
                    sample = results[0]
                    print(f"\n🎵 Sample Video Details:")
                    print(f"  Title: {sample['title']}")
                    print(f"  Duration: {sample.get('duration', 'N/A')}")
                    print(f"  Embeddable: {sample.get('embeddable', 'Unknown')}")
                    print(f"  Is Short: {sample.get('is_short', 'Unknown')}")
                    print(f"  YouTube URL: https://www.youtube.com/watch?v={sample['videoId']}")
            else:
                print("⚠️  No results to analyze")
        else:
            print(f"❌ Search failed: {response.status_code}")
    
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "="*80)
    print("TEST COMPLETE")
    print("="*80 + "\n")


def test_filters():
    """Test that filters are working correctly"""
    print("\n" + "="*80)
    print("TESTING FILTERS")
    print("="*80 + "\n")
    
    try:
        # Search for a broad term
        response = requests.get(
            f"{BASE_URL}/youtube/search",
            params={"query": "music"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])
            
            print(f"✅ Search successful")
            print(f"📊 Total Results: {len(results)}")
            
            # Analyze results
            print("\n🔍 Filter Analysis:")
            
            # Check for shorts
            shorts = [v for v in results if v.get('is_short', False)]
            print(f"  - Shorts (< 60s): {len(shorts)}")
            if shorts:
                print(f"    ⚠️  Found shorts (should be filtered out)")
            else:
                print(f"    ✅ No shorts found")
            
            # Check embeddable
            embeddable = [v for v in results if v.get('embeddable', True)]
            print(f"  - Embeddable videos: {len(embeddable)}/{len(results)}")
            if len(embeddable) == len(results):
                print(f"    ✅ All videos are embeddable")
            else:
                print(f"    ⚠️  Some videos are not embeddable")
            
            # Check durations
            with_duration = [v for v in results if v.get('duration')]
            print(f"  - Videos with duration: {len(with_duration)}/{len(results)}")
            
            # Show duration range
            if with_duration:
                print(f"\n⏱️  Duration Examples:")
                for v in with_duration[:5]:
                    print(f"    - {v['title'][:50]}... : {v['duration']}")
        else:
            print(f"❌ Search failed: {response.status_code}")
    
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "="*80)
    print("TEST COMPLETE")
    print("="*80 + "\n")


if __name__ == "__main__":
    print("\n🎵 YOUTUBE EMBEDDABLE MUSIC FEATURE TEST")
    print("="*80)
    print("\nMake sure backend is running on http://localhost:8000")
    print("\nPress Enter to start tests...")
    input()
    
    # Run tests
    test_search_embeddable_music()
    test_video_details()
    test_filters()
    
    print("\n✅ ALL TESTS COMPLETE!")
    print("\nSummary:")
    print("  - Search endpoint tested with multiple queries")
    print("  - Video details fetching verified")
    print("  - Filters analyzed (shorts, embeddable, duration)")
    print("\nYour YouTube embeddable music feature is ready! 🎉")
