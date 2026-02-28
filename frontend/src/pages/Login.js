import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const passwordRef = useRef();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('admin') === '1') {
      setUsername('dilum2003');
      setTimeout(() => passwordRef.current && passwordRef.current.focus(), 100);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      login(res.data);
      navigate('/'); // Redirect to home page
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '60px auto',
        padding: 30,
        border: '1px solid #ddd',
        borderRadius: 8,
        background: '#fff',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2 style={{ color: '#333', marginBottom: 20, textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: '100%',
            padding: 10,
            marginBottom: 15,
            borderRadius: 4,
            border: '1px solid #ddd',
            fontSize: 16,
          }}
        />
        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: '100%',
            padding: 10,
            marginBottom: 15,
            borderRadius: 4,
            border: '1px solid #ddd',
            fontSize: 16,
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: 12,
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          Login
        </button>
      </form>
      {error && (
        <p style={{ color: 'red', marginTop: 15, textAlign: 'center' }}>{error}</p>
      )}
      <p style={{ marginTop: 15, textAlign: 'center', color: '#666' }}>
        Don't have an account? <Link to="/register" style={{ color: '#007bff' }}>Register</Link>
      </p>
    </div>
  );
}