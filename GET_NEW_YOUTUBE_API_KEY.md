# 🔑 How to Get a New YouTube API Key

## Step-by-Step Guide (5-10 minutes)

### Step 1: Go to Google Cloud Console

1. Open your browser
2. Go to: **https://console.cloud.google.com/**
3. Sign in with your Google account

---

### Step 2: Create a New Project

1. At the top of the page, click on the **project dropdown** (next to "Google Cloud")
2. Click **"NEW PROJECT"** button (top right of the popup)
3. Fill in the details:
   - **Project name:** `Music Sagar` (or any name you like)
   - **Organization:** Leave as default
   - **Location:** Leave as default
4. Click **"CREATE"** button
5. Wait 10-20 seconds for the project to be created
6. You'll see a notification when it's ready

---

### Step 3: Select Your New Project

1. Click the **project dropdown** again (top of page)
2. Find and click on **"Music Sagar"** (your new project)
3. The page will reload with your project selected

---

### Step 4: Enable YouTube Data API v3

1. In the left sidebar, click **"APIs & Services"**
2. Click **"Library"** (or go directly to: https://console.cloud.google.com/apis/library)
3. In the search box, type: **"YouTube Data API v3"**
4. Click on **"YouTube Data API v3"** from the results
5. Click the blue **"ENABLE"** button
6. Wait a few seconds for it to enable
7. You'll see "API enabled" message

---

### Step 5: Create API Key

1. In the left sidebar, click **"Credentials"**
   - Or go to: https://console.cloud.google.com/apis/credentials
2. At the top, click **"+ CREATE CREDENTIALS"**
3. Select **"API key"** from the dropdown
4. A popup will appear with your new API key
5. **IMPORTANT:** Copy the API key immediately!
   - It looks like: `AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567`
6. Click **"CLOSE"** (or "RESTRICT KEY" if you want to add restrictions)

---

### Step 6: (Optional) Restrict API Key

**For better security, restrict your API key:**

1. After creating the key, you'll see it in the credentials list
2. Click on the **pencil icon** (edit) next to your API key
3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Check **"YouTube Data API v3"**
4. Under **"Application restrictions"** (optional):
   - Select **"HTTP referrers"** if using in browser
   - Or **"IP addresses"** if using from server
   - Add your website URL or IP address
5. Click **"SAVE"**

---

### Step 7: Update Your .env File

1. Open your project folder: `D:\Sagar\MusicSagar\`
2. Open the file: `backend\.env`
3. Find the line with `YOUTUBE_API_KEY`
4. Replace the old key with your new key:

```env
YOUTUBE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567
```

5. Save the file

---

### Step 8: Restart Your Backend

1. Stop the backend server (press `Ctrl+C` in the terminal)
2. Restart it:

```bash
cd backend
venv\Scripts\activate
python -m uvicorn app.main:app --reload
```

Or use the batch file:
```bash
start-local.bat
```

---

### Step 9: Test the New API Key

Run the diagnostic script:

```bash
python diagnose_youtube_api.py
```

You should see:
```
✅ SUCCESS! Found 5 results
```

---

### Step 10: Test in Your App

1. Open your browser: http://localhost:5173
2. Go to the Search page
3. Search for "arijit singh"
4. You should see results! 🎉

---

## Quick Reference

### Important URLs:

- **Google Cloud Console:** https://console.cloud.google.com/
- **API Library:** https://console.cloud.google.com/apis/library
- **Credentials:** https://console.cloud.google.com/apis/credentials
- **YouTube Data API v3:** https://console.cloud.google.com/apis/library/youtube.googleapis.com

### Your New Quota:

- **Daily Limit:** 10,000 units
- **Search Cost:** 100 units per request
- **Max Searches:** ~100 per day
- **Resets:** Every 24 hours (midnight Pacific Time)

---

## Troubleshooting

### Issue: "API not enabled"
**Solution:** Go back to Step 4 and enable YouTube Data API v3

### Issue: "API key not valid"
**Solution:** 
1. Check if you copied the entire key
2. Make sure there are no extra spaces
3. Restart the backend after updating .env

### Issue: Still getting 403 error
**Solution:**
1. Wait 1-2 minutes after creating the key
2. Make sure you enabled YouTube Data API v3
3. Check if you have any IP restrictions on the key

### Issue: "Project not found"
**Solution:** Make sure you selected the correct project in the dropdown

---

## Tips for Managing Quota

### 1. Implement Caching
Cache search results for 5-10 minutes to reduce API calls

### 2. Reduce Results
Change `maxResults` from 20 to 12 in the code

### 3. Use Database
Store searched songs in database for future use

### 4. Monitor Usage
Check your quota usage in Google Cloud Console:
- Go to: APIs & Services → Dashboard
- Click on YouTube Data API v3
- View the "Quotas" tab

### 5. Request Increase (For Production)
If you need more quota:
1. Go to: APIs & Services → YouTube Data API v3 → Quotas
2. Click "Request Quota Increase"
3. Fill out the form
4. Wait 1-2 days for approval
5. Can get up to 1,000,000 units/day

---

## Summary

1. ✅ Go to Google Cloud Console
2. ✅ Create new project
3. ✅ Enable YouTube Data API v3
4. ✅ Create API key
5. ✅ Copy the key
6. ✅ Update backend/.env file
7. ✅ Restart backend
8. ✅ Test and enjoy!

**Total Time:** 5-10 minutes

---

## Need Help?

If you get stuck:
1. Check the troubleshooting section above
2. Make sure you're signed in to Google
3. Try using a different browser
4. Clear your browser cache

**Your app will work perfectly with the new API key!** 🎉
