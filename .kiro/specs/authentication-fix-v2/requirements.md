# Authentication Fix v2 - Server-Side Sessions

## Problem
The current JWT token-based authentication with localStorage has persistent issues:
- Tokens disappear from localStorage after login
- Complex coordination between frontend/backend
- Browser security policies may block localStorage access

## Solution
Implement server-side session authentication with HTTP-only cookies:
- Sessions stored on backend
- Cookies automatically managed by browser
- No frontend token management needed
- More secure (HTTP-only cookies can't be accessed by JavaScript)

## Requirements

### Backend Changes

1. **Session Management**
   - Install `fastapi-sessions` or use custom session middleware
   - Store sessions in memory (or Redis for production)
   - Generate session IDs on login
   - Set HTTP-only cookies with session ID

2. **Authentication Endpoints**
   - POST /auth/signup - Create user, return session cookie
   - POST /auth/login - Validate credentials, return session cookie
   - POST /auth/logout - Clear session and cookie
   - GET /auth/me - Get current user from session

3. **Protected Routes**
   - Add session validation middleware
   - Extract user from session cookie
   - Return 401 if session invalid/expired

### Frontend Changes

1. **Remove Token Management**
   - Remove localStorage token code
   - Remove axios token interceptors
   - Let browser handle cookies automatically

2. **Authentication Flow**
   - Login: POST to /auth/login, browser stores cookie
   - Logout: POST to /auth/logout, browser clears cookie
   - Protected routes: Browser sends cookie automatically

3. **UI Updates**
   - Re-enable login/signup pages
   - Add proper authentication routing
   - Show user info when logged in

## Implementation Steps

1. Install session dependencies
2. Create session middleware
3. Update auth endpoints to use sessions
4. Update protected routes to check sessions
5. Update frontend to remove token code
6. Re-enable authentication in App.jsx
7. Test login/logout flow
8. Test protected routes

## Success Criteria

- User can signup successfully
- User can login and stay logged in
- User can access protected routes
- User can logout
- Sessions persist across page refreshes
- No token management in frontend code
