# Mood-Based Playlists - Requirements

## Overview
Add intelligent mood-based playlist generation with Indian language support and keyword tagging.

## Features

### 1. Mood Categories
- Happy
- Sad
- Workout
- Chill
- Party
- Devotional

### 2. Language Filters
- Hindi
- Marathi
- Tamil
- Telugu
- Punjabi
- English
- All Languages

### 3. Keyword Tagging System
Each mood will have associated keywords for YouTube search:

**Happy:**
- Keywords: happy songs, upbeat, cheerful, feel good, celebration
- Hindi: खुशी के गाने, मस्ती
- Marathi: आनंदी गाणी

**Sad:**
- Keywords: sad songs, emotional, heartbreak, melancholy
- Hindi: दुखी गाने, भावुक
- Marathi: दुःखी गाणी

**Workout:**
- Keywords: workout music, gym songs, motivation, energy
- Hindi: वर्कआउट गाने, जिम
- Marathi: व्यायाम गाणी

**Chill:**
- Keywords: chill music, relaxing, calm, peaceful, lofi
- Hindi: आराम के गाने
- Marathi: शांत गाणी

**Party:**
- Keywords: party songs, dance, club music, DJ
- Hindi: पार्टी गाने, डांस
- Marathi: पार्टी गाणी

**Devotional:**
- Keywords: bhajan, devotional, spiritual, prayer, aarti
- Hindi: भजन, आरती, भक्ति गीत
- Marathi: भजन, आरती

## User Interface

### Mood Selection Page
- Grid of mood cards with icons
- Each card shows mood name and icon
- Click to view mood-based songs
- Language filter dropdown

### Mood Playlist View
- Shows songs matching selected mood and language
- Auto-generated playlist name
- Option to save as custom playlist
- Shuffle and play all options

## Backend Requirements

### New Endpoints
1. `GET /moods` - List all available moods
2. `GET /moods/{mood_name}/songs?language={lang}` - Get songs for mood
3. `POST /moods/{mood_name}/playlist` - Create playlist from mood

### Database Schema
```sql
-- Moods table
CREATE TABLE moods (
    id INTEGER PRIMARY KEY,
    name VARCHAR(50) UNIQUE,
    icon VARCHAR(10),
    description TEXT
);

-- Mood keywords table
CREATE TABLE mood_keywords (
    id INTEGER PRIMARY KEY,
    mood_id INTEGER REFERENCES moods(id),
    keyword VARCHAR(100),
    language VARCHAR(20)
);
```

## Implementation Steps

1. Create mood database models
2. Seed mood data with keywords
3. Create mood API endpoints
4. Build mood selection UI
5. Implement mood playlist generation
6. Add language filtering
7. Test with different moods and languages
