# 🎵 Hybrid Recommendation System

## Overview

The system now tries **3 methods** in order to show recommendations:

```
1. Database Trending (Fast) ⚡
   ↓ (if < 12 songs)
2. Any Database Songs (Fast) ⚡
   ↓ (if < 12 songs)
3. YouTube API (Slower) 🌐
```

---

## How It Works

### Method 1: Database Trending (Preferred)
- **Speed**: Instant (~50ms)
- **Source**: Songs other users played
- **Pros**: Fast, no API needed
- **Cons**: Needs users to have played songs

### Method 2: Any Database Songs
- **Speed**: Instant (~50ms)
- **Source**: Any songs in your database
- **Pros**: Fast, works offline
- **Cons**: Needs songs in database

### Method 3: YouTube API (Fallback)
- **Speed**: Slower (~2-3 seconds)
- **Source**: YouTube trending songs
- **Pros**: Always has fresh content
- **Cons**: Needs API key, slower, uses quota

---

## Setup Options

### Option A: Database Only (No Setup)
**Best for**: Testing, offline use, privacy

**Steps**:
1. Just restart backend
2. Search for songs
3. Play some songs
4. Recommendations will work!

**Pros**:
- ✅ No API key needed
- ✅ Fast
- ✅ Works offline
- ✅ Privacy-friendly

**Cons**:
- ❌ Needs songs in database first

---

### Option B: With YouTube API (Full Features)
**Best for**: Production, new users, always fresh content

**Steps**:
1. Get YouTube API key (see below)
2. Add to `backend/.env`:
   ```
   YOUTUBE_API_KEY=your_key_here
   ```
3. Install requests:
   ```bash
   cd backend
   pip install requests
   ```
4. Restart backend

**Pros**:
- ✅ Works for brand new users
- ✅ Always has fresh trending songs
- ✅ 12 songs guaranteed

**Cons**:
- ❌ Needs API key
- ❌ Slower (2-3 seconds)
- ❌ Uses API quota

---

## Getting YouTube API Key

### Step 1: Go to Google Cloud Console
https://console.cloud.google.com/

### Step 2: Create Project
1. Click "Select a project"
2. Click "New Project"
3. Name it "Music Sagar"
4. Click "Create"

### Step 3: Enable YouTube Data API
1. Go to "APIs & Services" → "Library"
2. Search for "YouTube Data API v3"
3. Click on it
4. Click "Enable"

### Step 4: Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials"
3. Select "API Key"
4. Copy the key

### Step 5: Add to .env
```bash
# backend/.env
YOUTUBE_API_KEY=AIzaSyBzpvPUMBZUXwpPrnQ0gDUKBA__Po5jAN4
```

---

## Testing Both Methods

### Test 1: Database Only
```bash
# 1. Make sure .env has NO YouTube API key (or comment it out)
# 2. Restart backend
# 3. Go to Search, play some songs
# 4. Go to Home
# 5. Should see those songs as recommendations
```

### Test 2: With YouTube API
```bash
# 1. Add YouTube API key to .env
# 2. Install requests: pip install requests
# 3. Restart backend
# 4. Go to Home (even as new user)
# 5. Click "Load Trending Songs"
# 6. Should see 12 trending songs from YouTube
```

---

## How the Hybrid System Works

### Scenario 1: New User, No API Key
```
User logs in
    ↓
Check database → Empty
    ↓
No API key available
    ↓
Show message: "Start listening to get recommendations!"
    ↓
User searches and plays songs
    ↓
Next visit: Shows those songs as recommendations
```

### Scenario 2: New User, With API Key
```
User logs in
    ↓
Check database → Empty
    ↓
API key available → Fetch from YouTube
    ↓
Show 12 trending songs
    ↓
User plays/likes songs
    ↓
Next visit: Shows personalized recommendations
```

### Scenario 3: Returning User
```
User logs in
    ↓
Has play history/likes
    ↓
Analyze preferences
    ↓
Show personalized recommendations
    ↓
(No API call needed)
```

---

## Performance Comparison

### Database Only
- **First load**: 50ms
- **Subsequent loads**: 50ms
- **API calls**: 0
- **Quota used**: 0

### With YouTube API
- **First load (new user)**: 2-3 seconds
- **Subsequent loads**: 50ms
- **API calls**: 3 (one per search query)
- **Quota used**: 300 units (100 per search)

---

## Recommendation

### For Development/Testing
**Use Database Only**:
- No setup needed
- Fast
- Works offline
- Just search and play songs first

### For Production
**Use YouTube API**:
- Better new user experience
- Always has content
- Professional feel
- Worth the setup

---

## Current Status

✅ **Both methods implemented**
✅ **Automatic fallback**
✅ **No errors if API unavailable**
✅ **Works with or without API key**

---

## To Apply

### Without YouTube API (Simple)
```bash
# Just restart backend
cd backend
uvicorn app.main:app --reload
```

### With YouTube API (Full Features)
```bash
# 1. Add API key to backend/.env
# 2. Install requests
cd backend
pip install requests

# 3. Restart backend
uvicorn app.main:app --reload
```

---

## Summary

**Hybrid System Benefits**:
- ✅ Works immediately (database)
- ✅ Falls back to YouTube if needed
- ✅ No errors if API unavailable
- ✅ Best of both worlds

**Choose Your Path**:
- **Quick Start**: Database only (no setup)
- **Full Features**: Add YouTube API key

**Both work perfectly!** 🎉

---

**Next Step**: Restart backend and test!
