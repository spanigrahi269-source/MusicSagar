from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
import yt_dlp
import os
from pathlib import Path

router = APIRouter(prefix="/downloads", tags=["downloads"])

# Create downloads directory
DOWNLOADS_DIR = Path("downloads")
DOWNLOADS_DIR.mkdir(exist_ok=True)

@router.get("/song/{video_id}")
async def download_song(video_id: str):
    """
    Download a YouTube video as MP3 and return the file
    """
    try:
        output_path = DOWNLOADS_DIR / f"{video_id}.mp3"
        
        # Check if file already exists
        if output_path.exists():
            return FileResponse(
                path=str(output_path),
                media_type="audio/mpeg",
                filename=f"{video_id}.mp3"
            )
        
        # Download the audio
        youtube_url = f"https://www.youtube.com/watch?v={video_id}"
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'outtmpl': str(DOWNLOADS_DIR / f"{video_id}.%(ext)s"),
            'quiet': True,
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([youtube_url])
        
        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Failed to download song")
        
        return FileResponse(
            path=str(output_path),
            media_type="audio/mpeg",
            filename=f"{video_id}.mp3"
        )
        
    except Exception as e:
        print(f"Download error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to download: {str(e)}")

@router.get("/info/{video_id}")
async def get_download_info(video_id: str):
    """
    Get information about a downloadable song
    """
    try:
        output_path = DOWNLOADS_DIR / f"{video_id}.mp3"
        
        return {
            "video_id": video_id,
            "available": output_path.exists(),
            "file_size": output_path.stat().st_size if output_path.exists() else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
