import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

const categories = [
  'Men Wear',
  'Women Wear',
  'Oversized T-shirt',
  'Regular T-shirt',
  'Perfumes',
  'Croptop',
  'Polo T-shirt',
];

const sizes = ['S', 'M', 'L', 'XL'];

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [viewUser, setViewUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    if (tab === 'products') fetchProducts();
    if (tab === 'users') fetchUsers();
    if (tab === 'orders') fetchOrders();
  }, [tab]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setMessage(err.response?.data?.error || 'Error fetching products');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setMessage(err.response?.data?.error || 'Error fetching users');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setMessage(err.response?.data?.error || 'Error fetching orders');
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setMessage(err.response?.data?.error || 'Error deleting product');
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setMessage(err.response?.data?.error || 'Error deleting user');
    }
  };

  const deleteOrder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Order deleted successfully!');
      fetchOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
      setMessage(err.response?.data?.error || 'Error deleting order');
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product || { sizes: sizes.map((size) => ({ size, available: false })) });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const selectedSizes = formData.getAll('sizes');
    const sizesData = sizes.map((size) => ({
      size,
      available: selectedSizes.includes(size),
    }));
    formData.delete('sizes');
    formData.append('sizes', JSON.stringify(sizesData));
    try {
      if (editProduct && editProduct._id) {
        await axios.put(`http://localhost:5000/api/products/${editProduct._id}`, formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Product updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/products', formData, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Product added successfully!');
      }
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setMessage(err.response?.data?.error || 'Error saving product');
    }
  };

  const viewUserDetails = async (user) => {
    setViewUser(user);
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/user/${user._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserOrders(res.data);
    } catch (err) {
      console.error('Error fetching user orders:', err);
      setMessage(err.response?.data?.error || 'Error fetching user orders');
    }
  };

  const closeUserDetails = () => {
    setViewUser(null);
    setUserOrders([]);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2a5298, #1e3c72, #6b7280)',
        padding: '60px 20px',
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
          maxWidth: 1200,
          margin: '0 auto',
          padding: 30,
          fontFamily: "'Poppins', sans-serif",
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 12,
          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          position: 'relative',
          zIndex: 1,
          transform: 'translateY(20px)',
          opacity: 0,
          animation: 'slideUp 0.8s ease-out forwards',
        }}
      >
        <h2
          style={{
            color: '#1e3c72',
            marginBottom: 25,
            fontSize: '32px',
            fontWeight: '800',
            textAlign: 'center',
            letterSpacing: '1px',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffd700')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#1e3c72')}
        >
          Admin Dashboard
        </h2>
        <div
          style={{
            marginBottom: 30,
            display: 'flex',
            gap: 15,
            justifyContent: 'center',
            transform: 'translateY(20px)',
            opacity: 0,
            animation: 'slideUp 0.8s ease-out forwards',
            animationDelay: '0.2s',
          }}
        >
          {['products', 'users', 'orders'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '12px 30px',
                background: tab === t ? 'linear-gradient(45deg, #1e3c72, #2a5298)' : '#e9ecef',
                color: tab === t ? '#fff' : '#333',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'all 0.3s ease',
                boxShadow: tab === t ? '0 4px 10px rgba(0,0,0,0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = tab === t ? 'linear-gradient(45deg, #2a5298, #3b82f6)' : '#d1d5db';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = tab === t ? 'linear-gradient(45deg, #1e3c72, #2a5298)' : '#e9ecef';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = tab === t ? '0 4px 10px rgba(0,0,0,0.3)' : 'none';
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {message && (
          <p
            style={{
              color: message.includes('success') ? '#28a745' : '#dc3545',
              marginBottom: 20,
              fontSize: '16px',
              fontWeight: '600',
              textAlign: 'center',
              padding: '12px',
              background: message.includes('success') ? '#d4edda' : '#f8d7da',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              opacity: 0,
              animation: 'fadeInError 0.5s ease-in forwards',
            }}
          >
            {message}
          </p>
        )}
        {tab === 'products' && (
          <div>
            <button
              onClick={() => handleEditProduct(null)}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(45deg, #28a745, #34d058)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                marginBottom: 25,
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                transform: 'translateY(20px)',
                opacity: 0,
                animation: 'slideUp 0.8s ease-out forwards',
                animationDelay: '0.4s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #218838, #2fb44e)';
                e.currentTarget.style.transform = 'scale(1.05) translateY(20px)';
                e.currentTarget.style.boxShadow = '0 6px 15px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(45deg, #28a745, #34d058)';
                e.currentTarget.style.transform = 'scale(1) translateY(20px)';
                e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
              }}
            >
              Add Product
            </button>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #d1d5db',
                background: '#fff',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transform: 'translateY(20px)',
                opacity: 0,
                animation: 'slideUp 0.8s ease-out forwards',
                animationDelay: '0.6s',
              }}
            >
              <thead>
                <tr style={{ background: '#e9ecef' }}>
                  {['Name', 'Category', 'Price', 'Sizes', 'Status', 'Actions'].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: 15,
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1e3c72',
                        borderBottom: '2px solid #d1d5db',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr
                    key={p._id}
                    style={{
                      borderBottom: '1px solid #d1d5db',
                      transition: 'background 0.3s ease',
                      opacity: 0,
                      animation: `slideUp 0.8s ease-out forwards`,
                      animationDelay: `${0.8 + index * 0.1}s`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                  >
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>{p.name}</td>
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>{p.category}</td>
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>${p.price}</td>
                    <td style={{ padding: 15, fontSize: '15px' }}>
                      {p.sizes.map((s) => (
                        <span
                          key={s.size}
                          style={{
                            marginRight: 10,
                            color: s.available ? '#28a745' : '#dc3545',
                            fontWeight: '600',
                          }}
                        >
                          {s.size} {s.available ? '✓' : '✗'}
                        </span>
                      ))}
                    </td>
                    <td style={{ padding: 15, fontSize: '15px' }}>
                      <span
                        style={{
                          color: p.soldOut ? '#dc3545' : '#28a745',
                          fontWeight: '600',
                          padding: '5px 10px',
                          borderRadius: 6,
                          background: p.soldOut ? '#f8d7da' : '#d4edda',
                        }}
                      >
                        {p.soldOut ? 'Sold Out' : 'Available'}
                      </span>
                    </td>
                    <td style={{ padding: 15, display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => handleEditProduct(p)}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(45deg, #007bff, #3b82f6)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #0056b3, #2563eb)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #007bff, #3b82f6)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(p._id)}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(45deg, #dc3545, #e4606d)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #c82333, #d4525e)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #dc3545, #e4606d)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={async () => {
                          await axios.patch(
                            `http://localhost:5000/api/products/${p._id}/soldout`,
                            {},
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            }
                          );
                          fetchProducts();
                        }}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(45deg, #ffc107, #ffdb58)',
                          color: '#333',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #e0a800, #facc15)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #ffc107, #ffdb58)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        {p.soldOut ? 'Mark Available' : 'Mark Sold Out'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editProduct && (
              <form
                onSubmit={handleSaveProduct}
                style={{
                  marginTop: 30,
                  border: '1px solid #d1d5db',
                  padding: 30,
                  borderRadius: 12,
                  background: '#fff',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transform: 'translateY(20px)',
                  opacity: 0,
                  animation: 'slideUp 0.8s ease-out forwards',
                  animationDelay: '0.8s',
                }}
              >
                <h3
                  style={{
                    marginBottom: 25,
                    fontSize: '22px',
                    color: '#1e3c72',
                    fontWeight: '700',
                    textAlign: 'center',
                  }}
                >
                  {editProduct._id ? 'Edit Product' : 'Add Product'}
                </h3>
                <input
                  name="name"
                  defaultValue={editProduct.name || ''}
                  placeholder="Name"
                  required
                  style={{
                    width: '100%',
                    marginBottom: 20,
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: '15px',
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
                <textarea
                  name="description"
                  defaultValue={editProduct.description || ''}
                  placeholder="Description"
                  style={{
                    width: '100%',
                    marginBottom: 20,
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                    minHeight: 120,
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
                  name="price"
                  type="number"
                  defaultValue={editProduct.price || ''}
                  placeholder="Price"
                  required
                  step="0.01"
                  style={{
                    width: '100%',
                    marginBottom: 20,
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: '15px',
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
                <select
                  name="category"
                  defaultValue={editProduct.category || ''}
                  required
                  style={{
                    width: '100%',
                    marginBottom: 20,
                    padding: 12,
                    borderRadius: 8,
                    border: '1px solid #d1d5db',
                    fontSize: '15px',
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
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: 10,
                      fontWeight: '600',
                      color: '#1e3c72',
                      fontSize: '16px',
                    }}
                  >
                    Select Sizes:
                  </label>
                  {sizes.map((size, index) => (
                    <label
                      key={size}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: 12,
                        fontSize: '15px',
                        transform: 'translateY(10px)',
                        opacity: 0,
                        animation: `slideUp 0.8s ease-out forwards`,
                        animationDelay: `${1.0 + index * 0.1}s`,
                      }}
                    >
                      <input
                        type="checkbox"
                        name="sizes"
                        value={size}
                        defaultChecked={editProduct.sizes?.some((s) => s.size === size && s.available)}
                        style={{
                          marginRight: 10,
                          transform: 'scale(1.2)',
                          cursor: 'pointer',
                        }}
                      />
                      <span style={{ color: '#333', fontWeight: '500' }}>{size}</span>
                    </label>
                  ))}
                </div>
                <input
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  style={{
                    marginBottom: 20,
                    fontSize: '15px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                />
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 20,
                    fontSize: '15px',
                  }}
                >
                  <input
                    name="soldOut"
                    type="checkbox"
                    defaultChecked={editProduct.soldOut}
                    style={{
                      marginRight: 10,
                      transform: 'scale(1.2)',
                      cursor: 'pointer',
                    }}
                  />
                  <span style={{ fontWeight: '600', color: '#333' }}>Sold Out</span>
                </label>
                <div style={{ display: 'flex', gap: 15, justifyContent: 'center' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 30px',
                      background: 'linear-gradient(45deg, #28a745, #34d058)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(45deg, #218838, #2fb44e)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(45deg, #28a745, #34d058)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditProduct(null)}
                    style={{
                      padding: '12px 30px',
                      background: 'linear-gradient(45deg, #6c757d, #9ca3af)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontSize: '16px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(45deg, #5a6268, #8b9198)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(45deg, #6c757d, #9ca3af)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
        {tab === 'users' && (
          <div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #d1d5db',
                background: '#fff',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transform: 'translateY(20px)',
                opacity: 0,
                animation: 'slideUp 0.8s ease-out forwards',
                animationDelay: '0.6s',
              }}
            >
              <thead>
                <tr style={{ background: '#e9ecef' }}>
                  {['Username', 'Email', 'Role', 'Actions'].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: 15,
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1e3c72',
                        borderBottom: '2px solid #d1d5db',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, index) => (
                  <tr
                    key={u._id}
                    style={{
                      borderBottom: '1px solid #d1d5db',
                      transition: 'background 0.3s ease',
                      opacity: 0,
                      animation: `slideUp 0.8s ease-out forwards`,
                      animationDelay: `${0.8 + index * 0.1}s`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                  >
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>{u.username}</td>
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>{u.email}</td>
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>{u.role}</td>
                    <td style={{ padding: 15, display: 'flex', gap: 10 }}>
                      <button
                        onClick={() => viewUserDetails(u)}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(45deg, #007bff, #3b82f6)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #0056b3, #2563eb)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #007bff, #3b82f6)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => deleteUser(u._id)}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(45deg, #dc3545, #e4606d)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #c82333, #d4525e)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #dc3545, #e4606d)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {viewUser && (
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #d1d5db',
                  padding: 30,
                  marginTop: 30,
                  borderRadius: 12,
                  boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                  transform: 'translateY(20px)',
                  opacity: 0,
                  animation: 'slideUp 0.8s ease-out forwards',
                  animationDelay: '0.8s',
                }}
              >
                <h3
                  style={{
                    marginBottom: 20,
                    fontSize: '22px',
                    color: '#1e3c72',
                    fontWeight: '700',
                    textAlign: 'center',
                  }}
                >
                  User Details
                </h3>
                <p style={{ marginBottom: 12, fontSize: '15px', color: '#333' }}>
                  <b>Username:</b> {viewUser.username}
                </p>
                <p style={{ marginBottom: 12, fontSize: '15px', color: '#333' }}>
                  <b>Email:</b> {viewUser.email}
                </p>
                <p style={{ marginBottom: 12, fontSize: '15px', color: '#333' }}>
                  <b>Role:</b> {viewUser.role}
                </p>
                <p style={{ marginBottom: 12, fontSize: '15px', color: '#333' }}>
                  <b>Full Name:</b> {viewUser.profile?.fullName || 'Not set'}
                </p>
                <p style={{ marginBottom: 12, fontSize: '15px', color: '#333' }}>
                  <b>Address:</b> {viewUser.profile?.address || 'Not set'}
                </p>
                <p style={{ marginBottom: 12, fontSize: '15px', color: '#333' }}>
                  <b>Phone:</b> {viewUser.profile?.phone || 'Not set'}
                </p>
                <h4
                  style={{
                    marginTop: 20,
                    marginBottom: 15,
                    fontSize: '18px',
                    color: '#1e3c72',
                    fontWeight: '700',
                  }}
                >
                  Orders
                </h4>
                {userOrders.length === 0 ? (
                  <p style={{ fontSize: '15px', color: '#6b7280', textAlign: 'center' }}>
                    No orders found.
                  </p>
                ) : (
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      border: '1px solid #d1d5db',
                      background: '#fff',
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    }}
                  >
                    <thead>
                      <tr style={{ background: '#e9ecef' }}>
                        {['Order ID', 'Date', 'Status', 'Total', 'Products'].map((header) => (
                          <th
                            key={header}
                            style={{
                              padding: 15,
                              textAlign: 'left',
                              fontSize: '15px',
                              fontWeight: '700',
                              color: '#1e3c72',
                              borderBottom: '2px solid #d1d5db',
                            }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {userOrders.map((order, index) => (
                        <tr
                          key={order._id}
                          style={{
                            borderBottom: '1px solid #d1d5db',
                            transition: 'background 0.3s ease',
                            opacity: 0,
                            animation: `slideUp 0.8s ease-out forwards`,
                            animationDelay: `${1.0 + index * 0.1}s`,
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                        >
                          <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>{order._id}</td>
                          <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>
                            {new Date(order.createdAt).toLocaleString()}
                          </td>
                          <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>{order.status}</td>
                          <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>${order.total}</td>
                          <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>
                            {order.products.map((p, i) => (
                              <div key={i}>
                                {p.product?.name} (Size: {p.size}) x {p.quantity} (${p.product?.price})
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                <button
                  onClick={closeUserDetails}
                  style={{
                    marginTop: 25,
                    padding: '12px 30px',
                    background: 'linear-gradient(45deg, #6c757d, #9ca3af)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(45deg, #5a6268, #8b9198)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(45deg, #6c757d, #9ca3af)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
        {tab === 'orders' && (
          <div>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: '1px solid #d1d5db',
                background: '#fff',
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transform: 'translateY(20px)',
                opacity: 0,
                animation: 'slideUp 0.8s ease-out forwards',
                animationDelay: '0.6s',
              }}
            >
              <thead>
                <tr style={{ background: '#e9ecef' }}>
                  {['Order ID', 'User', 'Email', 'Date', 'Status', 'Total', 'Actions'].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: 15,
                        textAlign: 'left',
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#1e3c72',
                        borderBottom: '2px solid #d1d5db',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o, index) => (
                  <tr
                    key={o._id}
                    style={{
                      borderBottom: '1px solid #d1d5db',
                      transition: 'background 0.3s ease',
                      opacity: 0,
                      animation: `slideUp 0.8s ease-out forwards`,
                      animationDelay: `${0.8 + index * 0.1}s`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}
                  >
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>{o._id}</td>
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>
                      {o.user?.username || o.user?.email}
                    </td>
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>{o.user?.email}</td>
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>
                      {new Date(o.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>{o.status}</td>
                    <td style={{ padding: 15, fontSize: '15px', color: '#333' }}>${o.total}</td>
                    <td style={{ padding: 15 }}>
                      <button
                        onClick={() => deleteOrder(o._id)}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(45deg, #dc3545, #e4606d)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 6,
                          fontSize: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #c82333, #d4525e)';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(45deg, #dc3545, #e4606d)';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          @keyframes fadeInError {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}