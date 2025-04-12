import React, { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ sidebarValues }) => {
    const { sidebarValue, setSidebarValue } = sidebarValues;
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const navigate = useNavigate();
    

    // Check if the user is logged in when the component mounts
    const checkSession = async () => {
        try {
            const sessionResponse = await fetch('http://localhost:5000/session', {
                method: 'GET',
                credentials: 'include', // Include cookies for session retrieval
            });
            
            const sessionData = await sessionResponse.json();

            if (sessionData.session) {
                setIsLoggedIn(true); // User is logged in
            } else {
                setIsLoggedIn(false); // User is not logged in
            }
        } catch (error) {
            console.error('Error fetching session:', error);
            setIsLoggedIn(false); // In case of error, treat as not logged in
        }
    };

    useEffect(() => {
        checkSession(); //call checkSession() one time when the header first appears.
    }, []);

    const handleSidebar = () => {
            setSidebarValue(!sidebarValue);
    };

    const sidebarClose = () => {
        setSidebarValue(!sidebarValue);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarValue && !event.target.closest('.sidebar') && !event.target.closest('.logo')) {
                setSidebarValue(false);
            }
        };
    
        document.addEventListener("click", handleClickOutside);
    
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [sidebarValue]);

    const handleLogout = async () => {
        try {
            const logoutResponse = await fetch('http://localhost:5000/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure credentials (cookies) are sent
            });

            console.log('Logout Response:', logoutResponse); // Check the response object
            if (logoutResponse.ok) {
                setIsLoggedIn(false); // Update login status
                navigate('/home'); // Redirect to home page after logout
                checkSession(); // Re-check session after logout
                window.location.reload()

            } else {
                console.error('Logout failed: ', logoutResponse.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };


    return (
        <header>
           {isLoggedIn === null ? (
                <p>Loading...</p> // Display loading until session state is determined
            ) : isLoggedIn ? (
                <a 
                href="#" 
                className="logo btn" 
                onClick={handleSidebar} 
                // onBlur={sidebarClose}
            >
                <div className="for-text">
                    <img src={require('../img/user-profile.png')} alt="User Profile" />
                    <h4 className="logotext">Profile</h4> {/* Profile text below the image */}
                </div>
            </a>
            ) : (
                <></>
            )}
          
          <nav className="nav-links">
    <a href="#home" className="active">Home</a>
    <a href="#about">About</a>
    <a href="#course">Course</a>
    <a href="#contact">Contact</a>
    <a href="/tts" className="voice-assistant">Academic Voice Assistant</a>
</nav>

            {isLoggedIn === null ? (
                <p>Loading...</p> // Display loading until session state is determined
            ) : isLoggedIn ? (
                <button className="btn" onClick={handleLogout}>LOGOUT</button> // Logout button when logged in
            ) : (
                <Link to="/login" className="btn">LOGIN</Link> // Register button when not logged in
            )}
        </header>
    );
};

export default Header;
