import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .database import engine, Base
from .routers import auth, youtube, playlists, history, stats, offline, ai, proxy
from .init_db import init_database

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Create database tables and initialize with default data
Base.metadata.create_all(bind=engine)
init_database()

# Initialize FastAPI app
app = FastAPI(title="Music Sagar API", version="1.0.0")

# CORS middleware - Allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(youtube.router)
app.include_router(playlists.router)
app.include_router(history.router)
app.include_router(stats.router)
app.include_router(offline.router)
app.include_router(ai.router)
app.include_router(proxy.router)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

# Serve React frontend static files (used when running as EXE)
_static_dir = os.environ.get('STATIC_FILES_DIR')
if _static_dir and Path(_static_dir).exists():
    app.mount("/assets", StaticFiles(directory=str(Path(_static_dir) / "assets")), name="assets")

    @app.get("/")
    def serve_index():
        return FileResponse(str(Path(_static_dir) / "index.html"))

    # Catch-all: serve index.html for React Router client-side routes
    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        file_path = Path(_static_dir) / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(Path(_static_dir) / "index.html"))
else:
    @app.get("/")
    def root():
        return {"message": "Welcome to Music Sagar API"}
