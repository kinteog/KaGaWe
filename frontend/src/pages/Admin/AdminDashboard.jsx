import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="container">
      <h2 className="mb-4">Admin Dashboard</h2>
      <p>Welcome, Admin! Use the navigation above to manage:</p>
      <ul>
        <li>✅ Service Bookings</li>
        <li>✅ Users</li>
        <li>✅ Reviews</li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
