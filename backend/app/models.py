from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    theme = Column(String, default="dark")  # 'dark' or 'light'
    
    playlists = relationship("Playlist", back_populates="user")
    history = relationship("History", back_populates="user")
    likes = relationship("Like", back_populates="user")
    offline_songs = relationship("OfflineSong", back_populates="user")

class Song(Base):
    __tablename__ = "songs"
    
    id = Column(Integer, primary_key=True, index=True)
    youtube_video_id = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    thumbnail = Column(String)
    channel = Column(String)
    
    playlist_songs = relationship("PlaylistSong", back_populates="song")
    history = relationship("History", back_populates="song")
    likes = relationship("Like", back_populates="song")
    offline_songs = relationship("OfflineSong", back_populates="song")

class Playlist(Base):
    __tablename__ = "playlists"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    user = relationship("User", back_populates="playlists")
    playlist_songs = relationship("PlaylistSong", back_populates="playlist")

class PlaylistSong(Base):
    __tablename__ = "playlist_songs"
    
    id = Column(Integer, primary_key=True, index=True)
    playlist_id = Column(Integer, ForeignKey("playlists.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    
    playlist = relationship("Playlist", back_populates="playlist_songs")
    song = relationship("Song", back_populates="playlist_songs")

class History(Base):
    __tablename__ = "history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    played_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="history")
    song = relationship("Song", back_populates="history")

class Like(Base):
    __tablename__ = "likes"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="likes")
    song = relationship("Song", back_populates="likes")


class OfflineSong(Base):
    __tablename__ = "offline_songs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    song_id = Column(Integer, ForeignKey("songs.id"), nullable=False)
    saved_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="offline_songs")
    song = relationship("Song", back_populates="offline_songs")
