import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/auth';
import { NavMenu, Footer } from './components/navigation';
import { ProtectedRoute } from './components/auth';
import Home from './pages/Home.jsx';
import AboutUs from './pages/AboutUs.jsx';
import Venues from './pages/Venues.jsx';
import VenuePage from './pages/VenuePage.jsx';
import { CreateVenuePage, EditVenuePage } from './pages/create';
import Bookings from './pages/Bookings.jsx';
import VenueManagement from './pages/VenueManagement.jsx';
import Profile from './pages/profile/Profile.jsx';
import CreateProfile from './pages/profile/CreateProfile.jsx';
import MockProfile from './pages/MockProfile.jsx';
import EditProfile from './pages/EditProfile.jsx';
import Admin from './pages/Admin.jsx';
import ProjectProgress from './pages/ProjectProgress.jsx';
import FourOhFour from './pages/404.jsx';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <NavMenu />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/venue/:id" element={<VenuePage />} />
            <Route
              path="/venues/create"
              element={
                <ProtectedRoute>
                  <CreateVenuePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/venues/edit/:id"
              element={
                <ProtectedRoute>
                  <EditVenuePage />
                </ProtectedRoute>
              }
            />
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
            <Route path="/profile/create" element={<CreateProfile />} />
            <Route path="/mock-profile" element={<MockProfile />} />
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
            <Route path="/progress" element={<ProjectProgress />} />
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