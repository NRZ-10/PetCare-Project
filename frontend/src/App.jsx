import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Layouts
import OwnerLayout from './layouts/OwnerLayout';
import CaregiverLayout from './layouts/CaregiverLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterOwnerPage from './pages/RegisterOwnerPage';
import RegisterCaregiverPage from './pages/RegisterCaregiverPage';
import NotFound from './pages/NotFound';

// Admin Module Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminOwners from './pages/admin/Owners';
import AdminCaregivers from './pages/admin/Caregivers';
import AdminPets from './pages/admin/Pets';
import AdminBookings from './pages/admin/Bookings';
import AdminReviews from './pages/admin/Reviews';
import AdminComplaints from './pages/admin/Complaints';
import AdminReports from './pages/admin/Reports';

// Owner Module Pages
import OwnerDashboard from './pages/OwnerDashboard';
import MyPets from './pages/owner/MyPets';
import AddPet from './pages/owner/AddPet';
import PetDetails from './pages/owner/PetDetails';
import EditPet from './pages/owner/EditPet';
import OwnerProfile from './pages/owner/OwnerProfile';
import EditProfile from './pages/owner/EditProfile';
import SearchCaregivers from './pages/owner/SearchCaregivers';
import CaregiverProfileDetail from './pages/owner/CaregiverProfileDetail';
import Bookings from './pages/owner/Bookings';

// Caregiver Module Pages
import CaregiverDashboard from './pages/CaregiverDashboard';
import CaregiverProfileView from './pages/caregiver/CaregiverProfileView';
import EditCaregiverProfile from './pages/caregiver/EditCaregiverProfile';
import BookingRequests from './pages/caregiver/BookingRequests';
import BookingHistory from './pages/caregiver/BookingHistory';
import Reviews from './pages/caregiver/Reviews';

import ProtectedRoute from './routes/ProtectedRoute';

/** Shared shell: Navbar + content + Footer */
const PublicShell = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3500 }} />

        <Routes>
          {/* ─── Public Routes (with Navbar + Footer) ─── */}
          <Route path="/" element={<PublicShell><HomePage /></PublicShell>} />
          <Route path="/login" element={<PublicShell><LoginPage /></PublicShell>} />
          <Route path="/register-owner" element={<PublicShell><RegisterOwnerPage /></PublicShell>} />
          <Route path="/register-caregiver" element={<PublicShell><RegisterCaregiverPage /></PublicShell>} />

          {/* ─── Protected: Admin (uses AdminLayout) ─── */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="owners" element={<AdminOwners />} />
              <Route path="caregivers" element={<AdminCaregivers />} />
              <Route path="pets" element={<AdminPets />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="complaints" element={<AdminComplaints />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>
          </Route>

          {/* ─── Protected: Owner (uses OwnerLayout – no outer Navbar/Footer) ─── */}
          <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
            <Route path="/owner" element={<OwnerLayout />}>
              <Route index element={<OwnerDashboard />} />
              <Route path="pets" element={<MyPets />} />
              <Route path="pets/add" element={<AddPet />} />
              <Route path="pets/:id" element={<PetDetails />} />
              <Route path="pets/:id/edit" element={<EditPet />} />
              <Route path="profile" element={<OwnerProfile />} />
              <Route path="profile/edit" element={<EditProfile />} />
              <Route path="search" element={<SearchCaregivers />} />
              <Route path="caregiver/:id" element={<CaregiverProfileDetail />} />
              <Route path="bookings" element={<Bookings />} />
            </Route>
          </Route>

          {/* ─── Protected: Caregiver (uses CaregiverLayout) ─── */}
          <Route element={<ProtectedRoute allowedRoles={['caregiver']} />}>
            <Route path="/caregiver" element={<CaregiverLayout />}>
              <Route index element={<CaregiverDashboard />} />
              <Route path="profile" element={<CaregiverProfileView />} />
              <Route path="profile/edit" element={<EditCaregiverProfile />} />
              <Route path="requests" element={<BookingRequests />} />
              <Route path="history" element={<BookingHistory />} />
              <Route path="reviews" element={<Reviews />} />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<PublicShell><NotFound /></PublicShell>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
