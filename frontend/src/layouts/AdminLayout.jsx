import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/Header/AdminNavbar';
import Footer from '../components/Footer/Footer';

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <main className="container mt-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default AdminLayout;
