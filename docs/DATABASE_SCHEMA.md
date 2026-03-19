# Database Schema - PostgreSQL

## Complete Schema

```sql
-- ============================================
-- CACHE TABLES
-- ============================================

-- Search results cache (24 hours)
CREATE TABLE search_cache (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    language VARCHAR(20) DEFAULT 'all',
    results JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    hit_count INTEGER DEFAULT 0,
    INDEX idx_search_query (query, language),
    INDEX idx_search_expires (expires_at)
);

-- Video details cache (permanent)
CREATE TABLE videos (
    video_id VARCHAR(20) PRIMARY KEY,
    title TEXT NOT NULL,
    channel_id VARCHAR(50),
    channel_title TEXT,
    thumbnail_url TEXT,
    duration VARCHAR(20),
    view_count BIGINT,
    like_count BIGINT,
    published_at TIMESTAMP,
    description TEXT,
    tags JSONB,
    category_id VARCHAR(10),
    full_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_video_channel (channel_id),
    INDEX idx_video_published (published_at)
);

-- Channel details cache (7 days)
CREATE TABLE channels (
    channel_id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    subscriber_count BIGINT,
    video_count INTEGER,
    view_count BIGINT,
    country VARCHAR(10),
    full_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_channel_expires (expires_at)
);

-- Playlist cache (24 hours)
CREATE TABLE playlist_cache (
    playlist_id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    channel_id VARCHAR(50),
    channel_title TEXT,
    thumbnail_url TEXT,
    item_count INTEGER,
    items JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_playlist_expires (expires_at)
);

-- Trending/Home content (refreshed daily)
CREATE TABLE trending_content (
    id SERIAL PRIMARY KEY,
    content_type VARCHAR(20) NOT NULL, -- 'music', 'trending', 'recommended'
    video_ids JSONB NOT NULL,
    region VARCHAR(10) DEFAULT 'US',
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    INDEX idx_trending_type (content_type, region)
);

-- ============================================
-- USER DATA TABLES (No API usage)
-- ============================================

-- User likes (local only)
CREATE TABLE user_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    video_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, video_id),
    INDEX idx_likes_user (user_id),
    INDEX idx_likes_video (video_id)
);

-- User playlists (local only)
CREATE TABLE user_playlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_playlist_user (user_id)
);

-- Playlist items (local only)
CREATE TABLE playlist_items (
    id SERIAL PRIMARY KEY,
    playlist_id INTEGER NOT NULL,
    video_id VARCHAR(20) NOT NULL,
    position INTEGER NOT NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (playlist_id) REFERENCES user_playlists(id) ON DELETE CASCADE,
    INDEX idx_playlist_items (playlist_id),
    INDEX idx_playlist_video (video_id)
);

-- Watch history (local only)
CREATE TABLE user_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    video_id VARCHAR(20) NOT NULL,
    watched_at TIMESTAMP DEFAULT NOW(),
    watch_duration INTEGER, -- seconds watched
    completed BOOLEAN DEFAULT false,
    INDEX idx_history_user (user_id, watched_at DESC),
    INDEX idx_history_video (video_id)
);

-- Recently played (local only)
CREATE TABLE recently_played (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    video_id VARCHAR(20) NOT NULL,
    played_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, video_id),
    INDEX idx_recent_user (user_id, played_at DESC)
);

-- ============================================
-- QUOTA MANAGEMENT TABLES
-- ============================================

-- Daily quota tracking
CREATE TABLE quota_usage (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    endpoint VARCHAR(50) NOT NULL,
    units_used INTEGER NOT NULL,
    api_calls INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_quota_date (date),
    INDEX idx_quota_endpoint (endpoint)
);

-- Real-time quota counter
CREATE TABLE quota_daily_total (
    date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
    total_units INTEGER DEFAULT 0,
    total_calls INTEGER DEFAULT 0,
    quota_limit INTEGER DEFAULT 10000,
    is_paused BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User rate limiting
CREATE TABLE user_rate_limits (
    user_id INTEGER PRIMARY KEY,
    search_count INTEGER DEFAULT 0,
    last_search TIMESTAMP,
    is_blocked BOOLEAN DEFAULT false,
    reset_at TIMESTAMP,
    INDEX idx_rate_reset (reset_at)
);

-- ============================================
-- ANALYTICS TABLES
-- ============================================

-- Search analytics
CREATE TABLE search_analytics (
    id SERIAL PRIMARY KEY,
    query TEXT NOT NULL,
    user_id INTEGER,
    results_count INTEGER,
    from_cache BOOLEAN,
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_analytics_query (query),
    INDEX idx_analytics_date (created_at)
);

-- API call logs
CREATE TABLE api_call_logs (
    id SERIAL PRIMARY KEY,
    endpoint VARCHAR(100) NOT NULL,
    method VARCHAR(10),
    quota_cost INTEGER,
    response_code INTEGER,
    response_time_ms INTEGER,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_logs_endpoint (endpoint),
    INDEX idx_logs_date (created_at)
);
```

## Indexes Strategy

- Query patterns optimized
- Composite indexes for common filters
- Partial indexes for active data
- Regular VACUUM and ANALYZE

## Cache Expiration

- search_cache: 24 hours
- videos: Never (update on access if >30 days old)
- channels: 7 days
- playlist_cache: 24 hours
- trending_content: 24 hours
