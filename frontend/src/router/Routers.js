import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from "../pages/Home";
import Tours from "../pages/Tours";
import TourDetails from "../pages/TourDetails";
import Services from "../pages/Services";
import ServiceDetails from "../pages/ServiceDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SearchResultList from "../pages/SearchResultList";
import SparePartSearchResultList from "../pages/SparePartSearchResultList";
import ThankYou from '../pages/ThankYou';
import ServicesThankYou from '../pages/ServicesThankYou';
import SparePartThankYou from '../pages/SparePartThankYou';
import GenGallery from '../pages/Gallery';
import About from '../pages/About';
import ServiceSearchResultList from '../pages/ServiceSearchResultList';
import UserProfilePage from '../pages/UserProfilePage';


import AdminDashboard from '../pages/Admin/AdminDashboard';
import ServiceBookingTable from '../pages/Admin/ServiceBookingTable';
import AdminUsersPage from '../pages/Admin/AdminUsersPage';
import AdminSparePartsPage from '../pages/Admin/AdminSparePartsPage';
import AdminReviewsPage from '../pages/Admin/AdminReviewsPage';
import AdminServicesPage from '../pages/Admin/AdminServicesPage';
import AdminECUFilesPage from '../pages/Admin/AdminECUFilesPage';
import SpareParts from '../pages/SpareParts';
import SparePartDetails from '../pages/SparePartDetails';
import SparePartOrdersTable from '../pages/Admin/SparePartOrdersTable';
import EcuFileOrdersTable from '../pages/Admin/EcuFileOrdersTable';

import ECUFiles from "../pages/ECUFiles";
import ECUFileSearchResults from "../pages/ECUFileSearchResults";
import ECUFileDetails from "../pages/ECUFileDetails";



import RequireAdmin from '../components/VerifyAdmin/RequireAdmin';
import AdminLayout from '../layouts/AdminLayout';


const Routers = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/gallery" element={<GenGallery />} />
      <Route path="/tours" element={<Tours />} />
      <Route path="/tour/:id" element={<TourDetails />} />
      <Route path="/services" element={<Services />} />
      <Route path="/service/:id" element={<ServiceDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/services-thank-you" element={<ServicesThankYou />} />
      <Route path="/order-thank-you" element={<SparePartThankYou />} />
      <Route path="/tours/search" element={<SearchResultList />} />
      <Route path="/services/search" element={<ServiceSearchResultList />} />
      <Route path="/spare-parts/search" element={<SparePartSearchResultList />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/spare-parts" element={<SpareParts />} />
      <Route path="/spare-part/:id" element={<SparePartDetails />} />
      <Route path="/ecufiles" element={<ECUFiles />} />
      <Route path="/ecu-files/search" element={<ECUFileSearchResults />} />
      <Route path="/ecu-file/:id" element={<ECUFileDetails />} />


      {/* Admin routes using proper nesting */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminLayout />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="service-bookings" element={<ServiceBookingTable />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="services" element={<AdminServicesPage />} />
        <Route path="spareparts" element={<AdminSparePartsPage />} />
        <Route path="ecufiles" element={<AdminECUFilesPage />} />
        <Route path="sparepart-orders" element={<SparePartOrdersTable />} />
        <Route path="ecufiles-orders" element={<EcuFileOrdersTable />} />


      </Route>
    </Routes>
  );
};

export default Routers;
