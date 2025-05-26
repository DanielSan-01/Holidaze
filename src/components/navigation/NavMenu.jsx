import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';
import { AuthModal } from '../auth';
import HamburgerButton from './HamburgerButton';
import DesktopNav from './DesktopNav';
import AuthSection from './AuthSection';
import MobileMenu from './MobileMenu';

function NavMenu() {
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false); // Close mobile menu after logout
  };

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when opening auth modal
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false); // Close mobile menu when navigating
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Desktop and Mobile Header */}
        <div className="flex items-center justify-between">
          {/* Left side: Logo and Desktop Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="text-xl font-semibold" onClick={handleLinkClick}>
              Holidaze
            </Link>

            {/* Desktop Navigation */}
            <DesktopNav isActive={isActive} />
          </div>

          {/* Right side: Desktop Auth Section */}
          <AuthSection
            isAuthenticated={isAuthenticated}
            user={user}
            isActive={isActive}
            onLogout={handleLogout}
            onOpenAuthModal={openAuthModal}
            onLinkClick={handleLinkClick}
            isMobile={false}
          />

          {/* Mobile Hamburger Button */}
          <HamburgerButton
            isOpen={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          />
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          isActive={isActive}
          onLinkClick={handleLinkClick}
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={handleLogout}
          onOpenAuthModal={openAuthModal}
        />
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </nav>
  );
}

export default NavMenu; 