"""
Utility functions for the application
"""
import re
from typing import Optional


def parse_iso8601_duration(duration: str) -> Optional[str]:
    """
    Convert ISO 8601 duration format (e.g., PT3M45S, PT1H2M30S) to readable format (mm:ss or hh:mm:ss)
    
    Args:
        duration: ISO 8601 duration string (e.g., "PT3M45S", "PT1H2M30S", "PT45S")
    
    Returns:
        Formatted duration string (e.g., "3:45", "1:02:30", "0:45")
        Returns None if parsing fails
    
    Examples:
        PT3M45S -> "3:45"
        PT1H2M30S -> "1:02:30"
        PT45S -> "0:45"
        PT2H5S -> "2:00:05"
    """
    if not duration:
        return None
    
    try:
        # Pattern to match ISO 8601 duration: PT[hours]H[minutes]M[seconds]S
        pattern = r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?'
        match = re.match(pattern, duration)
        
        if not match:
            return None
        
        hours = int(match.group(1)) if match.group(1) else 0
        minutes = int(match.group(2)) if match.group(2) else 0
        seconds = int(match.group(3)) if match.group(3) else 0
        
        # Format based on duration length
        if hours > 0:
            # Format: h:mm:ss
            return f"{hours}:{minutes:02d}:{seconds:02d}"
        else:
            # Format: m:ss
            return f"{minutes}:{seconds:02d}"
    
    except Exception as e:
        print(f"Error parsing duration {duration}: {e}")
        return None


def format_duration_seconds(total_seconds: int) -> str:
    """
    Convert total seconds to readable format (mm:ss or hh:mm:ss)
    
    Args:
        total_seconds: Total duration in seconds
    
    Returns:
        Formatted duration string
    
    Examples:
        225 -> "3:45"
        3750 -> "1:02:30"
        45 -> "0:45"
    """
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    seconds = total_seconds % 60
    
    if hours > 0:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    else:
        return f"{minutes}:{seconds:02d}"
