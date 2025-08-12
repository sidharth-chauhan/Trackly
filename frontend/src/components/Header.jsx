import React from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const showLogoutButton = location.pathname !== '/' && location.pathname !== '/register';

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('token');
      window.location.href = '/Trackly/';
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
      <div className="container-fluid">
        <a 
          className="navbar-brand" 
          href="#" 
          style={{ 
            fontWeight: 700, 
            fontSize: '1.5rem', 
            color: '#007bff' 
          }}
        >
          Trackly
        </a>
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
