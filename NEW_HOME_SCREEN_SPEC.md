# 🎯 New Home Screen - YouTube Style

## Requirements Summary

### 4 Main Sections:

1. **Recommended For You** (10-15 songs)
   - Based on liked songs
   - Based on recently played
   - Fallback: Trending in India

2. **Trending Now 🔥** (Horizontal scroll)
   - Most popular music videos
   - regionCode = IN
   - Sort by view count

3. **Based on Your Last Played 🎧** (8-10 songs)
   - Same artist as last played
   - Similar title keywords

4. **Quick Mixes 🎵** (Dynamic)
   - "King Mix"
   - "Arijit Singh Mix"
   - Based on most listened artist

### UI Requirements:
- Grid layout (3-4 cards per row)
- Thumbnail on top
- Duration badge bottom-right
- Title below thumbnail
- Channel name
- View count + upload time
- Smooth hover effects
- Infinite scroll or "Load More"

### Behavior Rules:
- Never show static welcome screen
- Always show recommendations
- No duplicates
- Only embeddable music videos

### Data Per Video:
- videoId
- title
- channelTitle
- thumbnail
- duration
- viewCount
- publishedAt

## Implementation Plan:

### Backend:
1. Create new endpoint: `/youtube/home-feed`
2. Implement trending fetch (regionCode=IN)
3. Implement similar songs logic
4. Implement quick mixes generation
5. Add view count and published date to responses

### Frontend:
1. Redesign Home.jsx with 4 sections
2. Create YouTube-style card component
3. Add horizontal scroll for trending
4. Implement grid layout
5. Add duration badges
6. Add view count display
7. Implement infinite scroll

### API Quota Consideration:
- Each section = 1 search (100 units)
- Total per home load = ~400 units
- With 2 keys = ~50 home page loads per day
- Need to implement caching!

## Status: READY TO IMPLEMENT
