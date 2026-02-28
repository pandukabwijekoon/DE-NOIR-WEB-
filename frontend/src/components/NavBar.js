import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 40px',
        background: 'linear-gradient(135deg, #2a5298, #1e3c72, #6b7280)',
        color: '#fff',
        fontFamily: "'Poppins', sans-serif",
        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        animation: 'fadeIn 0.8s ease-in-out',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.6)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)')}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <Link
        to="/"
        style={{
          color: '#fff',
          textDecoration: 'none',
          fontWeight: '800',
          fontSize: '30px',
          letterSpacing: '1.5px',
          position: 'relative',
          zIndex: 1,
          transition: 'transform 0.3s ease, color 0.3s ease',
          transform: 'translateY(0)',
          animation: 'slideUp 0.8s ease-out',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#ffd700';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        DE NIOR CLOTHING
        <span
          style={{
            position: 'absolute',
            bottom: -3,
            left: 0,
            width: 0,
            height: '3px',
            background: '#ffd700',
            transition: 'width 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.width = '100%')}
          onMouseLeave={(e) => (e.currentTarget.style.width = '0')}
        />
      </Link>
      <div
        style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
          transform: 'translateY(20px)',
          opacity: 0,
          animation: 'slideUp 0.8s ease-out forwards',
          animationDelay: '0.2s',
        }}
      >
        <Link
          to="/"
          style={{
            color: '#d1d5db',
            textDecoration: 'none',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'color 0.3s ease, transform 0.3s ease',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffd700';
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#d1d5db';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Home
          <span
            style={{
              position: 'absolute',
              bottom: -2,
              left: 0,
              width: 0,
              height: '2px',
              background: '#ffd700',
              transition: 'width 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.width = '100%')}
            onMouseLeave={(e) => (e.currentTarget.style.width = '0')}
          />
        </Link>
        {user && (
          <>
            <Link
              to="/cart"
              style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'color 0.3s ease, transform 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffd700';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#d1d5db';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Cart
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: '2px',
                  background: '#ffd700',
                  transition: 'width 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.width = '100%')}
                onMouseLeave={(e) => (e.currentTarget.style.width = '0')}
              />
            </Link>
            <Link
              to="/orders"
              style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'color 0.3s ease, transform 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffd700';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#d1d5db';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              My Orders
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: '2px',
                  background: '#ffd700',
                  transition: 'width 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.width = '100%')}
                onMouseLeave={(e) => (e.currentTarget.style.width = '0')}
              />
            </Link>
            <Link
              to="/profile"
              style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'color 0.3s ease, transform 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffd700';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#d1d5db';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Profile
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: '2px',
                  background: '#ffd700',
                  transition: 'width 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.width = '100%')}
                onMouseLeave={(e) => (e.currentTarget.style.width = '0')}
              />
            </Link>
            {user.role === 'admin' && (
              <Link
                to="/admin"
                style={{
                  color: '#d1d5db',
                  textDecoration: 'none',
                  fontSize: '18px',
                  fontWeight: '600',
                  transition: 'color 0.3s ease, transform 0.3s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffd700';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#d1d5db';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Admin Dashboard
                <span
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: 0,
                    height: '2px',
                    background: '#ffd700',
                    transition: 'width 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.width = '100%')}
                  onMouseLeave={(e) => (e.currentTarget.style.width = '0')}
                />
              </Link>
            )}
          </>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '25px',
          position: 'relative',
          zIndex: 1,
          transform: 'translateY(20px)',
          opacity: 0,
          animation: 'slideUp 0.8s ease-out forwards',
          animationDelay: '0.4s',
        }}
      >
        {!user && (
          <>
            <Link
              to="/login"
              style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'color 0.3s ease, transform 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffd700';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#d1d5db';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Login
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: '2px',
                  background: '#ffd700',
                  transition: 'width 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.width = '100%')}
                onMouseLeave={(e) => (e.currentTarget.style.width = '0')}
              />
            </Link>
            <Link
              to="/register"
              style={{
                color: '#d1d5db',
                textDecoration: 'none',
                fontSize: '18px',
                fontWeight: '600',
                transition: 'color 0.3s ease, transform 0.3s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffd700';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#d1d5db';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Register
              <span
                style={{
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: 0,
                  height: '2px',
                  background: '#ffd700',
                  transition: 'width 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.width = '100%')}
                onMouseLeave={(e) => (e.currentTarget.style.width = '0')}
              />
            </Link>
            <Link
              to="/admin-login"
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #ff9800, #ffb300)',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #ffb300, #ffca28)';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #ff9800, #ffb300)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
              }}
            >
              Admin Login
            </Link>
          </>
        )}
        {user && (
          <>
            <span
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#d1d5db',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#d1d5db')}
            >
              Hello, {user.username}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(45deg, #dc3545, #e4606d)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #c82333, #d4525e)';
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #dc3545, #e4606d)';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
              }}
            >
              Logout
            </button>
          </>
        )}
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
        `}
      </style>
    </nav>
  );
}