import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/auth/AuthContext.jsx';
import NavMenu from './components/NavMenu.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Venues from './pages/Venues.jsx';
import Bookings from './pages/Bookings.jsx';
import VenueManagement from './pages/VenueManagement.jsx';
import Profile from './pages/Profile.jsx';
import MockProfile from './pages/MockProfile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Admin from './pages/Admin.jsx';
import FourOhFour from './pages/404.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavMenu />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/venues" element={<Venues />} />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/venues/manage"
              element={
                <ProtectedRoute>
                  <VenueManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mock-profile"
              element={
                <ProtectedRoute>
                  <MockProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/404" element={<FourOhFour />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App; 