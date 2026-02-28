import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('dilum2003');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const passwordRef = useRef();

  useEffect(() => {
    passwordRef.current && passwordRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/admin-login', { username, password });
      login(res.data);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Admin login failed. Please check your credentials.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #2a5298, #1e3c72, #6b7280)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 1.2s ease-in-out',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          maxWidth: 400,
          width: '90%',
          margin: '60px auto',
          padding: '40px',
          borderRadius: 12,
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          fontFamily: "'Poppins', sans-serif",
          position: 'relative',
          zIndex: 1,
          transform: 'translateY(20px)',
          opacity: 0,
          animation: 'slideUp 0.8s ease-out forwards',
          animationDelay: '0.2s',
        }}
      >
        <h2
          style={{
            color: '#1e3c72',
            marginBottom: 25,
            textAlign: 'center',
            fontSize: '28px',
            fontWeight: '700',
            letterSpacing: '1px',
            transition: 'color 0.3s ease',
          }}
        >
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 20,
              borderRadius: 6,
              border: '1px solid #d1d5db',
              fontSize: 16,
              fontFamily: "'Poppins', sans-serif",
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              background: '#f9fafb',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#ffd700';
              e.currentTarget.style.boxShadow = '0 0 8px rgba(255,215,0,0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }}
          />
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: 12,
              marginBottom: 20,
              borderRadius: 6,
              border: '1px solid #d1d5db',
              fontSize: 16,
              fontFamily: "'Poppins', sans-serif",
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              background: '#f9fafb',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#ffd700';
              e.currentTarget.style.boxShadow = '0 0 8px rgba(255,215,0,0.3)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: 14,
              background: 'linear-gradient(45deg, #ff9800, #ffb300)',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 16,
              fontWeight: '600',
              fontFamily: "'Poppins', sans-serif",
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg, #ffb300, #ffca28)';
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(45deg, #ff9800, #ffb300)';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
            }}
          >
            Admin Login
          </button>
        </form>
        {error && (
          <p
            style={{
              color: '#dc3545',
              marginTop: 20,
              textAlign: 'center',
              fontSize: 14,
              opacity: 0,
              animation: 'fadeInError 0.5s ease-in forwards',
            }}
          >
            {error}
          </p>
        )}
        <p
          style={{
            marginTop: 20,
            textAlign: 'center',
            color: '#6b7280',
            fontSize: 14,
            transform: 'translateY(10px)',
            opacity: 0,
            animation: 'slideUp 0.8s ease-out forwards',
            animationDelay: '0.4s',
          }}
        >
          Not an admin?{' '}
          <Link
            to="/login"
            style={{
              color: '#2a5298',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#2a5298')}
          >
            User Login
          </Link>
        </p>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes fadeInError {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}