# Quota-Optimized YouTube Music App Architecture

## System Overview

**Goal**: Support 200+ daily users within 10,000 quota units/day

**Stack**:
- Backend: FastAPI + PostgreSQL
- Frontend: React
- Cache: PostgreSQL + Redis (optional)
- Background Jobs: APScheduler

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        React Frontend                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Search  │  │   Home   │  │ Playlist │  │  Player  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │             │          │
│       └─────────────┴──────────────┴─────────────┘          │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────┼───────────────────────────────────┐
│                    FastAPI Backend                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Rate Limiter Middleware                      │ │
│  │     (5 searches/min per user, 500ms debounce)         │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              API Router Layer                          │ │
│  │  /search  /videos  /trending  /playlists  /channels   │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         YouTube Service Manager (Central)              │ │
│  │  • Check cache first                                   │ │
│  │  • Track quota usage                                   │ │
│  │  • Intelligent API calls                               │ │
│  │  • Bulk operations                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│           │                    │                    │        │
│     ┌─────┴─────┐       ┌─────┴─────┐       ┌─────┴─────┐ │
│     │  Cache    │       │  YouTube  │       │   Quota   │ │
│     │  Manager  │       │  API v3   │       │  Tracker  │ │
│     └─────┬─────┘       └───────────┘       └─────┬─────┘ │
└───────────┼─────────────────────────────────────────┼───────┘
            │                                         │
┌───────────┼─────────────────────────────────────────┼───────┐
│                    PostgreSQL Database                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ search_cache │  │    videos    │  │   channels   │     │
│  │ playlists    │  │   trending   │  │ quota_usage  │     │
│  │ user_likes   │  │ user_history │  │ user_limits  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────────────────────────┘
            │
┌───────────┼───────────────────────────────────────────────┐
│     Background Jobs (APScheduler)                          │
│  • Fetch trending daily (1x/day)                           │
│  • Clean expired cache                                     │
│  • Reset user rate limits                                  │
│  • Generate quota reports                                  │
└────────────────────────────────────────────────────────────┘
```

## Key Principles

1. **Cache Everything**: 95% of requests served from database
2. **Bulk Operations**: Fetch 50 videos at once, not 1 by 1
3. **Smart Invalidation**: Cache based on content type
4. **Rate Limiting**: Prevent abuse
5. **Quota Monitoring**: Stop before hitting limits
6. **Local Features**: Likes, playlists, history in DB only

## Quota Budget (10,000 units/day)

| Operation | Cost | Daily Calls | Total Units |
|-----------|------|-------------|-------------|
| Trending fetch (cron) | 100 | 1 | 100 |
| User searches (cached) | 100 | 30 | 3,000 |
| Video details (bulk) | 1 | 500 | 500 |
| Channel info | 1 | 100 | 100 |
| Playlist items | 1 | 50 | 50 |
| Reserve/Buffer | - | - | 6,250 |
| **TOTAL** | - | - | **10,000** |

With caching, actual API calls: ~50-100/day
