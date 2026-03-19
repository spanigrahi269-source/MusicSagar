from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# User Schemas
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Song Schemas
class SongBase(BaseModel):
    youtube_video_id: str
    title: str
    thumbnail: Optional[str] = None
    channel: Optional[str] = None

class SongResponse(SongBase):
    id: int
    
    class Config:
        from_attributes = True

# Playlist Schemas
class PlaylistCreate(BaseModel):
    name: str

class PlaylistResponse(BaseModel):
    id: int
    name: str
    user_id: int
    
    class Config:
        from_attributes = True

class AddSongToPlaylist(BaseModel):
    youtube_video_id: str
    title: str
    thumbnail: Optional[str] = None
    channel: Optional[str] = None

# History Schemas
class HistoryCreate(BaseModel):
    youtube_video_id: str
    title: str
    thumbnail: Optional[str] = None
    channel: Optional[str] = None

class HistoryResponse(BaseModel):
    id: int
    played_at: datetime
    song: SongResponse
    
    class Config:
        from_attributes = True
