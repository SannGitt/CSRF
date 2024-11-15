import React, { useState, useEffect } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom'; // Use this if using React Router
import './Navbar.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Default false initially
  const location = useLocation(); // Use this if using React Router

  useEffect(() => {
    // Check login status directly when the component mounts
    const userData = localStorage.getItem('user');
    setIsLoggedIn(!!userData); // Set loggedIn status based on presence of user data in localStorage


    // Add event listener for localStorage changes (e.g., logging in or out from another tab)
    const handleStorageChange = () => {
      const updatedUserData = localStorage.getItem('user');
      setIsLoggedIn(!!updatedUserData); // Update isLoggedIn state
    };

    window.addEventListener('storage', handleStorageChange);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    window.location.href = '/login'; // Redirect to login page after logging out
  };

  const handleChangePassword = () => {
    window.location.href = '/change-password'; // Redirect to change password page
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          <img
            src="/logo.png"
            alt="AMEHA Logo"
            width="70"
            height="70"
            className="d-inline-block align-text-centre"
          />
          AMEHA
        </a>

        {/* Conditionally render buttons when logged in */}
        {isLoggedIn && (
          <div className="navbar-right">
            {/* Hide "Change Password" button on the change-password page */}
            {location.pathname !== '/change-password' && (
              <button className="change-password-button" onClick={handleChangePassword}>
                Change Password
              </button>
            )}
            <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
          </div>
        )}
      </div>
    </nav>
  );
}
