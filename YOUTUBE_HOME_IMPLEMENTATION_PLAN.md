# YouTube-Style Home Page Implementation Plan

## Current Status:
❌ Not implemented yet - previous response was incomplete

## What Needs to Be Done:

### 1. Backend Changes:
- Add new endpoint `/youtube/home-feed` to `youtube.py`
- Implement 4 data fetching functions:
  - `get_trending_india()` - Trending music in India
  - `get_personalized_recommendations()` - Based on user history
  - `get_similar_to_last_played()` - Similar to last song
  - `get_artist_mixes()` - Dynamic artist mixes
- Add caching system (30-60 min cache)
- Add view count and publish date to video data

### 2. Frontend Changes:
- Complete rewrite of `Home.jsx`
- Create new `HomeYouTube.css` for styling
- Implement 4 sections with different layouts
- Add YouTube-style video cards
- Add duration badges
- Add view count display
- Add horizontal scrolling for trending
- Remove welcome screen completely

### 3. Estimated Time:
- Backend: ~200 lines of code
- Frontend: ~400 lines of code
- CSS: ~300 lines of styling
- Total: ~30-40 minutes to implement and test

### 4. API Cost:
- First load: ~400 units (4 searches)
- With caching: Minimal after first load

## Options:

**Option A: Full Implementation Now**
- I implement everything
- You restart backend
- Test immediately
- Costs ~400 API units

**Option B: Simplified Version**
- Just implement trending section
- Keep current recommendations
- Less API usage (~100 units)
- Faster to implement

**Option C: Tomorrow**
- Wait for API quotas to reset
- Full implementation with fresh quota
- More testing budget available

## My Recommendation:

Given that we've already done a lot today and your API quota is partially used, I recommend **Option B (Simplified)** for now:

1. Add just the trending section
2. Keep your current recommendations working
3. Tomorrow when quota resets, add the other 3 sections

This way you get something working today without using too much quota, and we can complete it tomorrow with fresh quota for testing.

What would you like to do?
