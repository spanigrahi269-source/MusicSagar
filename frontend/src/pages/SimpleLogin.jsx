import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function SimpleLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      // Store token and user info
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Reload to trigger auth check
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // First create account
      await axios.post(`${API_URL}/auth/signup`, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // Then login automatically
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      // Store token and user info
      localStorage.setItem('token', loginResponse.data.access_token);
      localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
      
      // Reload to trigger auth check
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <div className="logo-image-container">
            <svg className="logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 10 C 35 10, 25 20, 25 35 C 25 45, 30 50, 40 50 C 45 50, 50 47, 50 42 C 50 38, 47 35, 43 35 C 40 35, 38 37, 38 40 C 38 42, 39 43, 41 43 L 41 45 C 37 45, 35 42, 35 38 C 35 32, 40 28, 47 28 C 55 28, 60 33, 60 42 C 60 52, 52 60, 40 60 C 25 60, 15 48, 15 32 C 15 15, 28 5, 45 5 C 55 5, 63 10, 68 18 L 65 21 C 61 14, 54 10, 45 10 M 50 45 C 50 45, 55 50, 55 58 C 55 68, 48 75, 38 75 C 30 75, 25 70, 25 63 C 25 58, 28 55, 33 55 C 37 55, 40 57, 40 61 C 40 64, 38 66, 35 66 L 35 68 C 39 68, 42 65, 42 61 C 42 56, 38 52, 33 52 C 26 52, 20 57, 20 65 C 20 75, 28 82, 40 82 C 52 82, 62 72, 62 58 C 62 48, 56 42, 50 40" 
                    fill="#ffffff" 
                    stroke="#ffffff" 
                    strokeWidth="2"/>
              <text x="75" y="30" fontSize="20" fill="#ffffff" className="note-accent">♪</text>
              <text x="70" y="85" fontSize="16" fill="#ffffff" className="note-accent">♫</text>
            </svg>
          </div>
          <h1>Music Sagar</h1>
        </div>

        <p className="login-subtitle">
          {isLogin ? 'Login to your account' : 'Create a new account'}
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={isLogin ? handleLogin : handleSignup} className="login-form">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="login-input"
              required
            />
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
            required
            autoFocus={isLogin}
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
            required
          />
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '⏳ Please wait...' : (isLogin ? '🎵 Login' : '🎵 Sign Up')}
          </button>
        </form>

        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setFormData({ username: '', email: '', password: '' });
          }} 
          className="skip-btn"
        >
          {isLogin ? "Don't have an account? Sign Up →" : 'Already have an account? Login →'}
        </button>

        <p className="login-footer">
          Secure authentication with JWT tokens
        </p>
      </div>
    </div>
  );
}

export default SimpleLogin;
