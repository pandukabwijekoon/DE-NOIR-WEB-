import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'linear-gradient(135deg, #2a5298, #1e3c72, #6b7280)',
        color: '#fff',
        padding: '60px 20px',
        fontFamily: "'Poppins', sans-serif",
        textAlign: 'center',
        marginTop: 50,
        boxShadow: '0 -6px 15px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeIn 1s ease-in-out',
      }}
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
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 30,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 200,
            transform: 'translateY(20px)',
            opacity: 0,
            animation: 'slideUp 0.8s ease-out forwards',
            animationDelay: '0.2s',
          }}
        >
          <h3
            style={{
              fontSize: '22px',
              fontWeight: '800',
              marginBottom: 20,
              transition: 'color 0.4s ease, transform 0.3s ease',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffd700';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            DE NIOR CLOTHING
          </h3>
          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.7',
              color: '#d1d5db',
              transition: 'color 0.3s ease',
            }}
          >
            Your one-stop shop for trendy and comfortable clothing. Explore our curated collection for
            men and women, designed with style and quality in mind.
          </p>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            transform: 'translateY(20px)',
            opacity: 0,
            animation: 'slideUp 0.8s ease-out forwards',
            animationDelay: '0.4s',
          }}
        >
          <h3
            style={{
              fontSize: '22px',
              fontWeight: '800',
              marginBottom: 20,
              transition: 'color 0.4s ease, transform 0.3s ease',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffd700';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Quick Links
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {['Home', 'Cart', 'Orders', 'Profile'].map((item) => (
              <li
                key={item}
                style={{
                  marginBottom: 12,
                  transform: 'translateX(0)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <Link
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  style={{
                    color: '#d1d5db',
                    textDecoration: 'none',
                    fontSize: '16px',
                    transition: 'color 0.3s ease, transform 0.3s ease',
                    display: 'inline-block',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ffd700';
                    e.currentTarget.style.transform = 'translateX(8px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#d1d5db';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {item}
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
              </li>
            ))}
          </ul>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 200,
            transform: 'translateY(20px)',
            opacity: 0,
            animation: 'slideUp 0.8s ease-out forwards',
            animationDelay: '0.6s',
          }}
        >
          <h3
            style={{
              fontSize: '22px',
              fontWeight: '800',
              marginBottom: 20,
              transition: 'color 0.4s ease, transform 0.3s ease',
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ffd700';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Contact Us
          </h3>
          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.7',
              color: '#d1d5db',
              transition: 'color 0.3s ease',
            }}
          >
            Email: support@deniorclothing.com
            <br />
            Phone: +1 (123) 456-7890
            <br />
            Address: 123 Fashion St, Style City
          </p>
        </div>
      </div>
      <div
        style={{
          marginTop: 30,
          borderTop: '1px solid #6b7280',
          paddingTop: 25,
          fontSize: '14px',
          color: '#d1d5db',
          position: 'relative',
          zIndex: 1,
          transform: 'translateY(20px)',
          opacity: 0,
          animation: 'slideUp 0.8s ease-out forwards',
          animationDelay: '0.8s',
        }}
      >
        © {new Date().getFullYear()} DE NIOR CLOTHING. All rights reserved.
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
    </footer>
  );
}