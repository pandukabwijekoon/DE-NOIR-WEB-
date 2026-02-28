import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { user, token, login } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      setCart(user.cart || []);
    }
  }, [user]);

  const updateQuantity = async (index, qty) => {
    if (qty < 1) return;
    setLoading(true);
    const newCart = [...cart];
    if (!newCart[index].size || !['S', 'M', 'L', 'XL'].includes(newCart[index].size)) {
      setMessage('Invalid size detected in cart item');
      setLoading(false);
      return;
    }
    newCart[index].quantity = qty;
    setCart(newCart);
    try {
      console.log('Sending cart update (quantity):', newCart);
      await axios.put(
        'http://localhost:5000/api/profile/cart',
        { cart: newCart },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Cart updated successfully!');
      const updatedUser = { ...user, cart: newCart };
      login({ user: updatedUser, token });
    } catch (err) {
      console.error('Error updating cart:', err.response?.data || err);
      setMessage(err.response?.data?.error || 'Error updating cart');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (index) => {
    setLoading(true);
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    try {
      console.log('Sending cart update (remove):', newCart);
      await axios.put(
        'http://localhost:5000/api/profile/cart',
        { cart: newCart },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Item removed from cart!');
      const updatedUser = { ...user, cart: newCart };
      login({ user: updatedUser, token });
    } catch (err) {
      console.error('Error removing item:', err.response?.data || err);
      setMessage(err.response?.data?.error || 'Error updating cart');
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!cart.length) {
      setMessage('Cart is empty');
      return;
    }
    setLoading(true);
    try {
      const products = cart.map((item) => {
        if (!item.size || !['S', 'M', 'L', 'XL'].includes(item.size)) {
          throw new Error('Invalid size in cart item');
        }
        return {
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
        };
      });
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      console.log('Sending order:', { products, total });
      await axios.post(
        'http://localhost:5000/api/orders',
        { products, total },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCart([]);
      setMessage('Order placed successfully!');
      const updatedUser = { ...user, cart: [] };
      login({ user: updatedUser, token });
      setShowModal(false);
    } catch (err) {
      console.error('Error placing order:', err.response?.data || err);
      setMessage(err.response?.data?.error || err.message || 'Error placing order');
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const progress = Math.min((total / 500) * 100, 100); // Progress bar caps at $500

  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #6b7280, #4b5563)',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#ffffff',
            animation: 'pulse 2s infinite ease-in-out',
          }}
        >
          Please login to view your cart.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #7c3aed, #db2777, #f59e0b)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Particle Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            top: '10%',
            left: '15%',
            animation: 'particle 8s infinite ease-in-out',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            bottom: '15%',
            right: '20%',
            animation: 'particle-delayed 10s infinite ease-in-out',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.25)',
            borderRadius: '50%',
            top: '60%',
            left: '50%',
            animation: 'particle-slow 12s infinite ease-in-out',
          }}
        ></div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: '2rem',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            animation: 'slideIn 0.8s ease-out',
          }}
        >
          Your Shopping Cart
        </h2>
        {message && (
          <p
            style={{
              fontSize: '1.2rem',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              animation: 'fadeIn 0.5s ease-out',
              background: message.includes('success') || message.includes('Added') ? '#22c55e' : '#ef4444',
              color: '#ffffff',
            }}
          >
            {message}
          </p>
        )}
        {loading && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <div
              style={{
                width: '3rem',
                height: '3rem',
                border: '4px solid #ffffff',
                borderTop: '4px solid #7c3aed',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            ></div>
          </div>
        )}
        {cart.length === 0 ? (
          <p
            style={{
              textAlign: 'center',
              color: '#ffffff',
              fontSize: '1.5rem',
              animation: 'fadeIn 0.5s ease-out',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            Your cart is empty.
          </p>
        ) : (
          <>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {cart.map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    animation: `cardEntry ${0.5 + i * 0.2}s ease-out`,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>
                      {item.product?.name}
                    </h3>
                    <p style={{ color: '#4b5563', margin: '0.5rem 0' }}>Size: {item.size || 'N/A'}</p>
                    <p style={{ color: '#4b5563' }}>Price: ${item.product?.price}</p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      marginTop: '1rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(i, Number(e.target.value))}
                      style={{
                        width: '5rem',
                        padding: '0.5rem',
                        border: '2px solid #d1d5db',
                        borderRadius: '0.5rem',
                        outline: 'none',
                        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7c3aed';
                        e.target.style.boxShadow = '0 0 8px rgba(124, 58, 237, 0.5)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#d1d5db';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
                      ${item.product?.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeItem(i)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#ef4444',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease, transform 0.3s ease',
                        animation: 'buttonPulse 2s infinite ease-in-out',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#dc2626';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#ef4444';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '1.75rem',
                  fontWeight: '800',
                  color: '#ffffff',
                  marginBottom: '1rem',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  animation: 'pulse 2s infinite ease-in-out',
                }}
              >
                Total: ${total}
              </div>
              <div
                style={{
                  width: '100%',
                  background: '#e5e7eb',
                  borderRadius: '9999px',
                  height: '0.75rem',
                  marginBottom: '1rem',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${progress}%`,
                    height: '100%',
                    background: '#7c3aed',
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease',
                    animation: 'progressGlow 1.5s infinite ease-in-out',
                  }}
                ></div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: cart.length ? '#7c3aed' : '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.75rem',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  cursor: cart.length ? 'pointer' : 'not-allowed',
                  transition: 'background 0.3s ease, transform 0.3s ease',
                  animation: cart.length ? 'buttonPulse 2s infinite ease-in-out' : 'none',
                }}
                disabled={!cart.length}
                onMouseEnter={(e) => {
                  if (cart.length) {
                    e.target.style.background = '#6d28d9';
                    e.target.style.transform = 'scale(1.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (cart.length) {
                    e.target.style.background = '#7c3aed';
                    e.target.style.transform = 'scale(1)';
                  }
                }}
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>

      {/* Order Confirmation Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '1rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              animation: 'modalPop 0.4s ease-out',
            }}
          >
            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: '800',
                color: '#1f2937',
                marginBottom: '1rem',
              }}
            >
              Confirm Your Order
            </h3>
            <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
              Are you sure you want to place this order for ${total}?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease, transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6b7280';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#9ca3af';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Cancel
              </button>
              <button
                onClick={placeOrder}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#7c3aed',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease, transform 0.3s ease',
                  animation: 'buttonPulse 2s infinite ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#6d28d9';
                  e.target.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#7c3aed';
                  e.target.style.transform = 'scale(1)';
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes particle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
          50% {
            transform: translate(20px, -20px) scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.2;
          }
        }
        @keyframes particle-delayed {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.15;
          }
          50% {
            transform: translate(-15px, 15px) scale(1.1);
            opacity: 0.3;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.15;
          }
        }
        @keyframes particle-slow {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translate(10px, -10px) scale(0.9);
            opacity: 0.5;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.25;
          }
        }
        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes cardEntry {
          0% {
            opacity: 0;
            transform: translateX(-50px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes modalPop {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
        }
        @keyframes buttonPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.5);
          }
          50% {
            box-shadow: 0 0 10px 5px rgba(124, 58, 237, 0.3);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.5);
          }
        }
        @keyframes progressGlow {
          0% {
            box-shadow: 0 0 5px rgba(124, 58, 237, 0.5);
          }
          50% {
            box-shadow: 0 0 15px rgba(124, 58, 237, 0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(124, 58, 237, 0.5);
          }
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}