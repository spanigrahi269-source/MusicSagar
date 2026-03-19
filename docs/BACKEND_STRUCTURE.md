# Backend Folder Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI app entry
│   ├── config.py                    # Configuration
│   ├── database.py                  # DB connection
│   │
│   ├── models/                      # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── cache.py                 # Cache tables
│   │   ├── user.py                  # User data
│   │   ├── quota.py                 # Quota tracking
│   │   └── analytics.py             # Analytics
│   │
│   ├── schemas/                     # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── youtube.py               # YouTube responses
│   │   ├── user.py                  # User requests
│   │   └── cache.py                 # Cache schemas
│   │
│   ├── services/                    # Business logic
│   │   ├── __init__.py
│   │   ├── youtube_service.py       # Central YouTube manager
│   │   ├── cache_service.py         # Cache operations
│   │   ├── quota_service.py         # Quota tracking
│   │   └── rate_limiter.py          # Rate limiting
│   │
│   ├── routers/                     # API endpoints
│   │   ├── __init__.py
│   │   ├── search.py                # Search endpoints
│   │   ├── videos.py                # Video endpoints
│   │   ├── channels.py              # Channel endpoints
│   │   ├── playlists.py             # Playlist endpoints
│   │   ├── trending.py              # Trending/Home
│   │   ├── user_data.py             # Likes, history
│   │   └── admin.py                 # Quota monitoring
│   │
│   ├── middleware/                  # Middleware
│   │   ├── __init__.py
│   │   ├── rate_limit.py            # Rate limiting
│   │   ├── quota_check.py           # Quota validation
│   │   └── logging.py               # Request logging
│   │
│   ├── background/                  # Background jobs
│   │   ├── __init__.py
│   │   ├── scheduler.py             # APScheduler setup
│   │   ├── trending_job.py          # Fetch trending daily
│   │   ├── cache_cleanup.py         # Clean expired cache
│   │   └── quota_reset.py           # Reset rate limits
│   │
│   ├── utils/                       # Utilities
│   │   ├── __init__.py
│   │   ├── youtube_api.py           # Raw API calls
│   │   ├── cache_helpers.py         # Cache utilities
│   │   └── quota_calculator.py      # Quota calculations
│   │
│   └── tests/                       # Tests
│       ├── __init__.py
│       ├── test_youtube_service.py
│       ├── test_cache.py
│       └── test_quota.py
│
├── alembic/                         # Database migrations
│   ├── versions/
│   └── env.py
│
├── requirements.txt
├── .env
└── README.md
```

## Key Files Purpose

### main.py
- FastAPI app initialization
- Middleware registration
- Router inclusion
- Background job startup

### services/youtube_service.py
- Central YouTube API manager
- All API calls go through here
- Implements caching logic
- Tracks quota usage

### services/cache_service.py
- Cache read/write operations
- Expiration handling
- Cache invalidation
- Hit/miss tracking

### services/quota_service.py
- Track daily quota usage
- Check if quota available
- Pause API calls at 80%
- Generate quota reports

### middleware/rate_limit.py
- Per-user rate limiting
- 5 searches/minute
- Block spam users
- Reset counters

### background/scheduler.py
- APScheduler configuration
- Job registration
- Error handling
- Logging

## Dependencies (requirements.txt)

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
alembic==1.12.1
pydantic==2.5.0
pydantic-settings==2.1.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
httpx==0.25.1
apscheduler==3.10.4
redis==5.0.1  # Optional
python-dotenv==1.0.0
```
