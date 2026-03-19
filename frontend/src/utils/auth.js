// Cookie-based token management (more reliable than localStorage)

export const setAuthToken = (token) => {
  // Set cookie with 24 hour expiry
  const expires = new Date();
  expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
  document.cookie = `auth_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  
  // Also set in localStorage and sessionStorage as backup
  try {
    localStorage.setItem('token', token);
    sessionStorage.setItem('token', token);
  } catch (e) {
    console.error('Storage not available:', e);
  }
};

export const getAuthToken = () => {
  // Try cookie first
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'auth_token') {
      return value;
    }
  }
  
  // Fallback to localStorage
  try {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  } catch (e) {
    return null;
  }
};

export const removeAuthToken = () => {
  // Remove cookie
  document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  
  // Remove from storage
  try {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  } catch (e) {
    console.error('Storage not available:', e);
  }
};

export const hasAuthToken = () => {
  return !!getAuthToken();
};
