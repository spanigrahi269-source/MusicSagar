# Blinking Page Fix ✅

## Problem
The login page was blinking/flickering instead of showing properly.

## Root Cause
Two issues were causing redirect loops:

1. **Axios Interceptor**: The 401 error handler was redirecting to `/login` even when already on the login page, creating an infinite redirect loop.

2. **App.jsx Theme Fetch**: The `fetchUserTheme()` function was making an API call to `/auth/me` on every app load, even when not logged in. This caused a 401 error, which triggered the redirect loop.

## Fixes Applied

### Fix 1: Axios Interceptor (`frontend/src/api/axios.js`)
Added check to prevent redirect when already on login/signup pages:

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login/signup page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### Fix 2: App.jsx Theme Fetch (`frontend/src/App.jsx`)
Added token check before making API call:

```javascript
const fetchUserTheme = async () => {
  // Only fetch theme if user is logged in
  const token = localStorage.getItem('token');
  if (!token) return;
  
  try {
    const response = await api.get('/auth/me');
    if (response.data.theme) {
      setTheme(response.data.theme);
    }
  } catch (err) {
    console.error('Failed to fetch theme:', err);
  }
};
```

## How It Works Now

### When Not Logged In
1. User visits app
2. No token in localStorage
3. ProtectedRoute redirects to `/login`
4. Login page loads without making any API calls
5. No 401 errors, no redirect loop
6. Page displays normally

### When Logged In
1. User visits app
2. Token exists in localStorage
3. ProtectedRoute allows access
4. App fetches user theme
5. Pages load normally

### On 401 Error (Token Expired)
1. API call returns 401
2. Interceptor checks current path
3. If not on login/signup, redirects to login
4. If already on login/signup, does nothing
5. No redirect loop

## Testing

### Test 1: Fresh Visit (No Token)
1. Clear localStorage
2. Go to http://localhost:5173
3. Should redirect to login page
4. Login page should display without blinking
5. ✅ PASS

### Test 2: Login
1. Enter credentials
2. Click Login
3. Should redirect to home page
4. No blinking or errors
5. ✅ PASS

### Test 3: Logout
1. Click Logout in sidebar
2. Should redirect to login page
3. No blinking or errors
4. ✅ PASS

### Test 4: Direct URL Access
1. Logout
2. Try to access http://localhost:5173/search
3. Should redirect to login page
4. No blinking or errors
5. ✅ PASS

## Files Changed
- `frontend/src/api/axios.js` - Added path check in 401 interceptor
- `frontend/src/App.jsx` - Added token check before fetching theme

## Result
✅ Login page displays normally without blinking
✅ No redirect loops
✅ Authentication works correctly
✅ Theme fetching only happens when logged in
