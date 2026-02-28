import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const categories = [
  '',
  'Men Wear',
  'Women Wear',
  'Oversized T-shirt',
  'Regular T-shirt',
  'Perfumes',
  'Croptop',
  'Polo T-shirt',
];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');
  const debounceTimeout = useRef();

  useEffect(() => {
    fetchProducts();
  }, [search, category]);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      const res = await axios.get('http://localhost:5000/api/products', { params });
      setProducts(res.data);
      setError('');
    } catch (err) {
      setError('Error fetching products. Please try again.');
      setProducts([]);
    }
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setSearch(e.target.value);
    }, 400);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearch(searchInput);
    }
  };

  const handleSearchButton = () => {
    setSearch(searchInput);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: 20 }}>DE NIOR CLOTHING</h2>
      <div style={{ display: 'flex', gap: 15, marginBottom: 30, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchInput}
          onChange={handleSearchInput}
          onKeyDown={handleSearchKeyDown}
          style={{ flex: 1, padding: 10, borderRadius: 4, border: '1px solid #ddd' }}
        />
        <button
          onClick={handleSearchButton}
          style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}
        >
          Search
        </button>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ padding: 10, borderRadius: 4, border: '1px solid #ddd', width: 200 }}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat || 'All Categories'}</option>
          ))}
        </select>
      </div>
      {error && <p style={{ color: 'red', marginBottom: 20 }}>{error}</p>}
      {products.length === 0 && !error ? (
        <p style={{ textAlign: 'center', color: '#666' }}>No products found.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {products.map(product => (
            <div
              key={product._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 15,
                background: '#fff',
                position: 'relative',
                transition: 'box-shadow 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              {product.soldOut && (
                <span
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: 'red',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 4,
                    fontWeight: 'bold',
                    fontSize: 12,
                  }}
                >
                  Sold Out
                </span>
              )}
              {product.images && product.images[0] ? (
                <img
                  src={`http://localhost:5000${product.images[0]}`}
                  alt={product.name}
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 6, marginBottom: 10 }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: 180,
                    background: '#f0f0f0',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  No Image
                </div>
              )}
              <h4 style={{ margin: '10px 0', color: '#333' }}>{product.name}</h4>
              <p style={{ color: '#666', margin: '5px 0' }}>{product.category}</p>
              <p style={{ color: '#666', margin: '5px 0' }}>Sizes: {product.sizes.join(', ')}</p>
              <p style={{ fontWeight: 'bold', color: '#333', margin: '5px 0' }}>${product.price}</p>
              <Link
                to={`/product/${product._id}`}
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  background: '#007bff',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: 4,
                  marginTop: 10,
                }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}