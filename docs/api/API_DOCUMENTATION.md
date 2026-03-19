# Music Sagar - API Documentation

Base URL: `http://localhost:8000`

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [YouTube Search](#youtube-search)
3. [Playlists](#playlists)
4. [History](#history)
5. [Error Responses](#error-responses)

---

## 🔐 Authentication

### Signup
Create a new user account.

**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "username": "string",
  "email": "user@example.com",
  "password": "string"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "created_at": "2024-01-01T00:00:00"
}
```

**Errors:**
- `400 Bad Request` - Username or email already exists

---

### Login
Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- `401 Unauthorized` - Incorrect email or password

---

## 🔍 YouTube Search

### Search Music Videos
Search for music videos on YouTube.

**Endpoint:** `GET /youtube/search`

**Query Parameters:**
- `query` (required): Search term

**Headers:**
```
Authorization: Bearer <token>
```

**Example Request:**
```bash
GET /youtube/search?query=arijit%20singh
```

**Response:** `200 OK`
```json
{
  "results": [
    {
      "videoId": "abc123",
      "title": "Song Title",
      "thumbnail": "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
      "channelTitle": "Channel Name"
    }
  ]
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - YouTube API error

---

## 📚 Playlists

### Create Playlist
Create a new playlist for the authenticated user.

**Endpoint:** `POST /playlists`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "My Playlist"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "My Playlist",
  "user_id": 1
}
```

---

### Get User Playlists
Retrieve all playlists for the authenticated user.

**Endpoint:** `GET /playlists`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "My Playlist",
    "user_id": 1
  },
  {
    "id": 2,
    "name": "Favorites",
    "user_id": 1
  }
]
```

---

### Add Song to Playlist
Add a song to a specific playlist.

**Endpoint:** `POST /playlists/{playlist_id}/add-song`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `playlist_id`: ID of the playlist

**Request Body:**
```json
{
  "youtube_video_id": "abc123",
  "title": "Song Title",
  "thumbnail": "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
  "channel": "Channel Name"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "youtube_video_id": "abc123",
  "title": "Song Title",
  "thumbnail": "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
  "channel": "Channel Name"
}
```

**Errors:**
- `404 Not Found` - Playlist not found
- `400 Bad Request` - Song already in playlist

---

### Delete Playlist
Delete a playlist.

**Endpoint:** `DELETE /playlists/{playlist_id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Path Parameters:**
- `playlist_id`: ID of the playlist

**Response:** `204 No Content`

**Errors:**
- `404 Not Found` - Playlist not found

---

## 📜 History

### Add to History
Add a song to user's listening history.

**Endpoint:** `POST /history`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "youtube_video_id": "abc123",
  "title": "Song Title",
  "thumbnail": "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
  "channel": "Channel Name"
}
```

**Response:** `201 Created`
```json
{
  "message": "Added to history"
}
```

---

### Get Listening History
Retrieve user's listening history (last 50 songs).

**Endpoint:** `GET /history`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "played_at": "2024-01-01T12:00:00",
    "song": {
      "id": 1,
      "youtube_video_id": "abc123",
      "title": "Song Title",
      "thumbnail": "https://i.ytimg.com/vi/abc123/hqdefault.jpg",
      "channel": "Channel Name"
    }
  }
]
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "detail": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

---

## 🔑 Authentication Flow

1. **Signup/Login** to get JWT token
2. **Store token** in localStorage or secure storage
3. **Include token** in Authorization header for all protected endpoints
4. **Token format:** `Bearer <token>`

### Example with cURL:
```bash
# Login
TOKEN=$(curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' \
  | jq -r '.access_token')

# Use token
curl http://localhost:8000/playlists \
  -H "Authorization: Bearer $TOKEN"
```

### Example with JavaScript:
```javascript
// Login
const response = await fetch('http://localhost:8000/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});
const { access_token } = await response.json();

// Use token
const playlists = await fetch('http://localhost:8000/playlists', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

---

## 📊 Rate Limits

Currently no rate limits are enforced. In production, consider:
- 100 requests per minute per user
- 1000 requests per hour per IP
- YouTube API has daily quota limits

---

## 🔄 API Versioning

Current version: `v1`

Future versions will be prefixed: `/api/v2/...`

---

## 🧪 Interactive Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI documentation where you can:
- Test all endpoints
- See request/response schemas
- Try authentication
- View all available operations

---

## 📝 Notes

- All timestamps are in UTC
- All responses are in JSON format
- Token expires after 7 days
- YouTube search returns max 20 results
- History is limited to last 50 songs

---

## 🆘 Support

For issues or questions:
1. Check error response details
2. Review logs: `docker-compose logs backend`
3. Verify token is valid and not expired
4. Ensure YouTube API key has quota remaining

Happy coding! 🎵
