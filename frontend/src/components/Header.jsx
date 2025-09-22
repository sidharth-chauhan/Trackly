import React from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const showLogoutButton = location.pathname !== '/' && location.pathname !== '/register';

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      window.location.href = '/'; // ✅ better for Vercel, no /Trackly/ base
    }
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark" 
      style={{ 
        backgroundColor: '#fff', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '0.75rem 2rem' 
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo + Brand */}
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img 
            src="/pic.png"   // ✅ served from public/
            alt="Trackly Logo" 
            style={{ height: '40px', marginRight: '10px' }} 
          />
          <span style={{ fontWeight: 700, fontSize: '1.5rem', color: '#007bff' }}>
            Trackly
          </span>
        </a>

        {/* Logout Button */}
        {showLogoutButton && (
          <button 
            className="btn btn-outline-danger" 
            onClick={handleLogout}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Header;
