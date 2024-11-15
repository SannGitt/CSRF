import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousal from './Carousal';
import './Home.css';
import Card from './Card';

const Home = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [clothData, setClothData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in by looking for user data in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLoggedIn(true);
      setEmail(JSON.parse(storedUser).email); // Assuming the user object has an email field
    } else {
      setLoggedIn(false);
    }
  }, []); // Empty dependency array means this runs once on component mount

  const onButtonClick = () => {
    if (loggedIn) {
      // Handle logout logic
      localStorage.removeItem('user'); // Clear user data (assuming it's stored in localStorage)
      setLoggedIn(false); // Update state to reflect logout
      navigate('/login'); // Navigate to login after logout
    } else {
      navigate('/signup'); // Navigate to SignUp if not logged in
    }
  };

  const handleChangePassword = () => {
    // Navigate to the Change Password page
    navigate('/change-password');
  };

  useEffect(() => {
    // Fetch cloth data from ClothData.json
    fetch('/ClothData.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setClothData(data))
      .catch(error => {
        console.error('Error fetching cloth data:', error);
      });
  }, []);

  return (
    <div className="home-container">
      <div className="content-container">
        <Carousal />
        <div className="welcome-message">
          <h1>Welcome!!</h1>
        </div>
        <div className="message-container">
          {loggedIn ? (
            <div className="logged-in-message">

            </div>
          ) : (
            <p>Please SignUp to proceed.</p>
          )}
        </div>
        {/* <div className="button-container">
          <button className="action-button" onClick={onButtonClick}>
            {loggedIn ? 'Log out' : 'SignUp'}
          </button>
          {loggedIn && (
            <button className="change-password-button" onClick={handleChangePassword}>
              Change Password
            </button>
          )}
        </div> */}
      </div>

      {/* Display Cloth Data */}
      <div className="cloth-data-container">
        <h2>Available Cloths</h2>
        <div className="cloth-grid">
          {clothData.map((item, index) => (
            <div key={index} className="cloth-card">
              <img src={item.img} alt={item.name} className="img-fluid" />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>{item.CategoryName}</p>
            </div>
          ))}
        </div>
      </div>

      <Card />
    </div>
  );
};

export default Home;
