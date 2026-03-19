"""
Simple session management for Music Sagar
Uses in-memory storage for sessions
"""
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict
from fastapi import Cookie, HTTPException, status

# In-memory session store
# Format: {session_id: {"user_id": int, "expires": datetime}}
sessions: Dict[str, dict] = {}

SESSION_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

def create_session(user_id: int) -> str:
    """Create a new session for a user"""
    session_id = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(minutes=SESSION_EXPIRE_MINUTES)
    
    sessions[session_id] = {
        "user_id": user_id,
        "expires": expires
    }
    
    return session_id

def get_session(session_id: Optional[str]) -> Optional[dict]:
    """Get session data if valid"""
    if not session_id:
        return None
    
    session = sessions.get(session_id)
    if not session:
        return None
    
    # Check if expired
    if session["expires"] < datetime.utcnow():
        # Clean up expired session
        del sessions[session_id]
        return None
    
    return session

def delete_session(session_id: str):
    """Delete a session"""
    if session_id in sessions:
        del sessions[session_id]

def get_user_id_from_session(session_id: Optional[str] = Cookie(None, alias="session_id")) -> int:
    """
    Dependency to get user_id from session cookie
    Raises 401 if session invalid
    """
    session = get_session(session_id)
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    return session["user_id"]

def get_user_id_optional(session_id: Optional[str] = Cookie(None, alias="session_id")) -> Optional[int]:
    """
    Optional dependency to get user_id from session cookie
    Returns None if not authenticated (doesn't raise error)
    """
    session = get_session(session_id)
    if not session:
        return None
    
    return session["user_id"]
