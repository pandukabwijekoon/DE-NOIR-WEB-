import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setError('');
    } catch (err) {
      setOrders([]);
      setError(err.response?.data?.error || 'Error fetching orders.');
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: 20 }}>Your Orders</h2>
      {error && <p style={{ color: 'red', marginBottom: 20 }}>{error}</p>}
      {orders.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center' }}>No orders found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>Order ID</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Date</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Total</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Products</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: 12 }}>{order._id}</td>
                <td style={{ padding: 12 }}>{new Date(order.createdAt).toLocaleString()}</td>
                <td style={{ padding: 12 }}>{order.status}</td>
                <td style={{ padding: 12 }}>${order.total}</td>
                <td style={{ padding: 12 }}>
                  {order.products.map((p, i) => (
                    <div key={i}>
                      {p.product?.name || 'Product'} (Size: {p.size}) x {p.quantity}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}