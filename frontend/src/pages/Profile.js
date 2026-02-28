import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

export default function Profile() {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    fullName: '',
    address: '',
    phone: '',
    avatar: '',
  });
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfile(user.profile || {});
      setCart(user.cart || []);
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching orders');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:5000/api/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating profile');
    }
  };

  const updateQuantity = async (index, qty) => {
    if (qty < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = qty;
    setCart(newCart);
    try {
      await axios.put('http://localhost:5000/api/profile/cart', { cart: newCart }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Cart updated!');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating cart');
    }
  };

  const removeItem = async (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    try {
      await axios.put('http://localhost:5000/api/profile/cart', { cart: newCart }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Item removed from cart!');
    } catch (err) {
      setError(err.response?.data?.error || 'Error updating cart');
    }
  };

  const placeOrder = async () => {
    if (!cart.length) return;
    try {
      const products = cart.map(item => ({ product: item.product._id, quantity: item.quantity }));
      const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      await axios.post('http://localhost:5000/api/orders', { products, total }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
      setMessage('Order placed successfully!');
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.error || 'Error placing order');
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <h2>Your Profile</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div style={{ marginBottom: 30, border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
        <h3>Personal Information</h3>
        <form onSubmit={handleProfileUpdate}>
          <input
            type="text"
            placeholder="Full Name"
            value={profile.fullName || ''}
            onChange={e => setProfile({ ...profile, fullName: e.target.value })}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <input
            type="text"
            placeholder="Address"
            value={profile.address || ''}
            onChange={e => setProfile({ ...profile, address: e.target.value })}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={profile.phone || ''}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <input
            type="text"
            placeholder="Avatar URL"
            value={profile.avatar || ''}
            onChange={e => setProfile({ ...profile, avatar: e.target.value })}
            style={{ width: '100%', marginBottom: 10, padding: 8 }}
          />
          <button type="submit" style={{ padding: 10 }}>Update Profile</button>
        </form>
      </div>

      <div style={{ marginBottom: 30 }}>
        <h3>Your Cart</h3>
        {cart.length === 0 ? <p>Cart is empty.</p> : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, i) => (
                  <tr key={i}>
                    <td>{item.product?.name}</td>
                    <td>${item.product?.price}</td>
                    <td>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => updateQuantity(i, Number(e.target.value))}
                        style={{ width: 50 }}
                      />
                    </td>
                    <td>${item.product?.price * item.quantity}</td>
                    <td><button onClick={() => removeItem(i)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <b>Total: ${cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)}</b>
              <br />
              <button onClick={placeOrder} style={{ marginTop: 10 }} disabled={!cart.length}>Place Order</button>
            </div>
          </>
        )}
      </div>

      <div>
        <h3>Purchase History</h3>
        {orders.length === 0 ? <p>No orders found.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleString()}</td>
                  <td>{order.status}</td>
                  <td>${order.total}</td>
                  <td>
                    {order.products.map((p, i) => (
                      <div key={i}>{p.product?.name || 'Product'} x {p.quantity}</div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}