import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user, token, login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const found = res.data;
        if (!found) {
          setError('Product not found');
          return;
        }
        setProduct(found);
        const availableSize = found.sizes?.find((s) => s.available)?.size || '';
        setSelectedSize(availableSize);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.response?.data?.error || 'Error fetching product details. Please try again later.');
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      setMessage('Please login to add items to cart');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (!selectedSize || !['S', 'M', 'L', 'XL'].includes(selectedSize)) {
      setMessage('Please select a valid size (S, M, L, XL)');
      return;
    }
    try {
      let cart = user.cart || [];
      const existing = cart.find((item) => item.product._id === product._id && item.size === selectedSize);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ product: product._id, quantity: 1, size: selectedSize });
      }
      console.log('Sending cart update:', cart); // Debug payload
      const res = await axios.put(
        'http://localhost:5000/api/profile/cart',
        { cart },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage('Added to cart!');
      const updatedUser = { ...user, cart: res.data.cart };
      login({ user: updatedUser, token });
    } catch (err) {
      console.error('Error adding to cart:', err.response?.data || err);
      setMessage(err.response?.data?.error || 'Error adding to cart');
    }
  };

  const buyNow = async () => {
    if (!user) {
      setMessage('Please login to buy products');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    if (!selectedSize || !['S', 'M', 'L', 'XL'].includes(selectedSize)) {
      setMessage('Please select a valid size (S, M, L, XL)');
      return;
    }
    try {
      let cart = user.cart || [];
      const existing = cart.find((item) => item.product._id === product._id && item.size === selectedSize);
      if (!existing) {
        cart.push({ product: product._id, quantity: 1, size: selectedSize });
        console.log('Sending cart update for buyNow:', cart); // Debug payload
        await axios.put(
          'http://localhost:5000/api/profile/cart',
          { cart },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedUser = { ...user, cart };
        login({ user: updatedUser, token });
      }
      navigate('/cart');
    } catch (err) {
      console.error('Error buying product:', err.response?.data || err);
      setMessage(err.response?.data?.error || 'Error buying product');
    }
  };

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40, fontFamily: "'Poppins', sans-serif", color: '#dc3545' }}>
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40, fontFamily: "'Poppins', sans-serif", color: '#666' }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 800,
        margin: '40px auto',
        padding: 20,
        fontFamily: "'Poppins', sans-serif",
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ color: '#1e3c72', marginBottom: 20, fontSize: '28px', fontWeight: '700' }}>
        {product.name}
      </h2>
      {product.soldOut && (
        <span
          style={{
            background: '#dc3545',
            color: '#fff',
            padding: '6px 16px',
            borderRadius: 6,
            fontWeight: '600',
            fontSize: '14px',
            display: 'inline-block',
            marginBottom: 15,
          }}
        >
          Sold Out
        </span>
      )}
      <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          {product.images && product.images.length > 0 ? (
            <img
              src={`http://localhost:5000${product.images[0]}`}
              alt={product.name}
              style={{
                width: '100%',
                maxHeight: 300,
                objectFit: 'cover',
                borderRadius: 8,
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: 300,
                background: '#f0f0f0',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: '#666',
              }}
            >
              No Image
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 300 }}>
          <p style={{ margin: '10px 0', color: '#666', fontSize: '16px' }}>
            <b>Category:</b> {product.category}
          </p>
          <p style={{ margin: '10px 0', color: '#666', fontSize: '16px' }}>
            <b>Price:</b> ${product.price}
          </p>
          <p style={{ margin: '10px 0', color: '#666', fontSize: '16px' }}>
            {product.description}
          </p>
          <div style={{ margin: '10px 0' }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#333' }}>
              Select Size:
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              style={{
                padding: 10,
                borderRadius: 6,
                border: '1px solid #dee2e6',
                width: '100%',
                fontSize: '15px',
                transition: 'border-color 0.3s ease',
              }}
              disabled={product.soldOut || !product.sizes?.some((s) => s.available)}
              onFocus={(e) => (e.currentTarget.style.borderColor = '#007bff')}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#dee2e6')}
            >
              <option value="">Select a size</option>
              {product.sizes
                ?.filter((s) => s.available)
                .map((s) => (
                  <option key={s.size} value={s.size}>
                    {s.size}
                  </option>
                ))}
            </select>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button
              onClick={addToCart}
              disabled={product.soldOut || !product.sizes?.some((s) => s.available)}
              style={{
                padding: '12px 24px',
                background: product.soldOut || !product.sizes?.some((s) => s.available) ? '#ccc' : '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: '16px',
                cursor: product.soldOut || !product.sizes?.some((s) => s.available) ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!product.soldOut && product.sizes?.some((s) => s.available)) {
                  e.currentTarget.style.background = '#0056b3';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!product.soldOut && product.sizes?.some((s) => s.available)) {
                  e.currentTarget.style.background = '#007bff';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              Add to Cart
            </button>
            <button
              onClick={buyNow}
              disabled={product.soldOut || !product.sizes?.some((s) => s.available)}
              style={{
                padding: '12px 24px',
                background: product.soldOut || !product.sizes?.some((s) => s.available) ? '#ccc' : '#28a745',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: '16px',
                cursor: product.soldOut || !product.sizes?.some((s) => s.available) ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!product.soldOut && product.sizes?.some((s) => s.available)) {
                  e.currentTarget.style.background = '#218838';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!product.soldOut && product.sizes?.some((s) => s.available)) {
                  e.currentTarget.style.background = '#28a745';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              Buy Now
            </button>
          </div>
          {message && (
            <p
              style={{
                color: message.includes('success') || message.includes('Added') ? '#28a745' : '#dc3545',
                marginTop: 15,
                fontSize: '15px',
                textAlign: 'center',
                padding: '10px',
                background: message.includes('success') || message.includes('Added') ? '#d4edda' : '#f8d7da',
                borderRadius: 6,
              }}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}