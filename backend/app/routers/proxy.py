from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
import requests

router = APIRouter(prefix="/proxy", tags=["Proxy"])

@router.get("/image")
async def proxy_image(url: str):
    """
    Proxy YouTube thumbnail images to bypass CORS issues
    
    Usage: /proxy/image?url=https://i.ytimg.com/vi/VIDEO_ID/mqdefault.jpg
    """
    try:
        # Validate URL is from YouTube
        if not url.startswith(('https://i.ytimg.com/', 'https://img.youtube.com/')):
            raise HTTPException(status_code=400, detail="Invalid image URL")
        
        # Add headers to mimic browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.youtube.com/'
        }
        
        # Fetch image from YouTube
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            # Return image with proper content type
            return Response(
                content=response.content,
                media_type=response.headers.get('content-type', 'image/jpeg'),
                headers={
                    'Cache-Control': 'public, max-age=86400',  # Cache for 24 hours
                    'Access-Control-Allow-Origin': '*'
                }
            )
        else:
            print(f"Failed to fetch image: {url} - Status: {response.status_code}")
            raise HTTPException(status_code=response.status_code, detail="Failed to fetch image")
    
    except requests.RequestException as e:
        print(f"Error fetching image: {url} - {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch image")
