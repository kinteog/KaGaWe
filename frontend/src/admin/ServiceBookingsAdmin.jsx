// src/admin/ServiceBookingsAdmin.jsx
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/config';
import './admin.css';

const ServiceBookingsAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetch(`${BASE_URL}/servicebooking`, {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setBookings(data.data))
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const res = await fetch(`${BASE_URL}/servicebooking/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setBookings(bookings.filter(booking => booking._id !== id));
      }
    }
  };

  const startEdit = (booking) => {
    setEditingId(booking._id);
    setFormData({ ...booking });
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    const res = await fetch(`${BASE_URL}/servicebooking/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });
    const result = await res.json();
    if (res.ok) {
      setBookings(prev => prev.map(b => b._id === editingId ? result.data : b));
      setEditingId(null);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Service Bookings Admin Panel</h2>
      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Vehicle</th>
            <th>Service</th>
            <th>Booked Date</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(booking => (
            <tr key={booking._id}>
              {editingId === booking._id ? (
                <>
                  <td><input name="fullName" value={formData.fullName} onChange={handleChange} /></td>
                  <td><input name="phone" value={formData.phone} onChange={handleChange} /></td>
                  <td><input name="email" value={formData.email} onChange={handleChange} /></td>
                  <td>
                    <input name="vehicleMake" value={formData.vehicleMake} onChange={handleChange} placeholder="Make" />
                    <input name="vehicleModel" value={formData.vehicleModel} onChange={handleChange} placeholder="Model" />
                  </td>
                  <td><input name="serviceName" value={formData.serviceName} onChange={handleChange} /></td>
                  <td><input name="bookedDate" value={formData.bookedDate} onChange={handleChange} type="datetime-local" /></td>
                  <td>
                    <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                      <option value="Online">Online</option>
                      <option value="Deposit">Deposit</option>
                      <option value="Pay-on-Arrival">Pay-on-Arrival</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={handleUpdate}>Save</button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{booking.fullName}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.email}</td>
                  <td>{booking.vehicleMake} {booking.vehicleModel}</td>
                  <td>{booking.serviceName}</td>
                  <td>{new Date(booking.bookedDate).toLocaleString()}</td>
                  <td>{booking.paymentMethod}</td>
                  <td>
                    <button onClick={() => startEdit(booking)}>Edit</button>
                    <button onClick={() => handleDelete(booking._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceBookingsAdmin;
