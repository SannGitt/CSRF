import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(''); // Unified state for both success and error messages
  const [messageColor, setMessageColor] = useState(''); // Color for the message (red for error, green for success)
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically submit a request to change the password
    const autoSubmit = async () => {
      try {
        // Assuming user is stored in localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          console.log('User not found. Please log in.');
          return;
        }

        // Automatically changing the password without user interaction
        const response = await fetch('http://localhost:4200/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: user.name, // Assuming the user name is stored in localStorage
            currentPassword: currentPassword || 'oldPassword123', // Old password for validation
            newPassword: 'newSecurePassword123', // New password
            confirmPassword: 'newSecurePassword123', // Confirm new password
          }),
        });

        const data = await response.json();

        if (response.status === 200) {
          setMessage('Password updated successfully');
          setMessageColor('green');
          // Redirect after 3 seconds
          setTimeout(() => {
            navigate('/home');
          }, 3000);
        } else {
          setMessage(data.message || 'Error updating password');
          setMessageColor('red');
        }
      } catch (error) {
        console.error('Error:', error);
        setMessage('An error occurred while updating the password');
        setMessageColor('red');
      }
    };

    autoSubmit();
  }, [navigate, currentPassword]); // Include navigate and currentPassword in dependencies

  const handleSubmit = async e => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageColor('red');
      return;
    }

    // API request to change the password
    const response = await fetch('http://localhost:4200/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: JSON.parse(localStorage.getItem('user')).name,
        currentPassword,
        newPassword,
        confirmPassword,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      setMessage('Password updated successfully');
      setMessageColor('green');
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    } else {
      setMessage(data.message || 'Error updating password');
      setMessageColor('red');
    }
  };

  return (
    <div className="change-password-container">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {/* Show message after error or success */}
        {message && <p style={{ color: messageColor }}>{message}</p>}
        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
