import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Important for fetching session cookies
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Login successful!');
                // Fetch and console the session data
                const sessionResponse = await fetch('http://localhost:5000/session', {
                    method: 'GET',
                    credentials: 'include', // Include cookies for session retrieval
                });
                const sessionData = await sessionResponse.json();
                console.log('Session data:', sessionData); // Log the session data to the console
                navigate('/home'); // Redirect to home page
            } else {
                alert(data.error);
            }
        } catch (err) {
            alert('An error occurred while signing in.');
        }
    };

    return (
        <div className='container register form form-2'>
            <span className='circle circle-1'></span>
            <span className='circle circle-2'></span>
            <span className='circle circle-3'></span>
            <span className='circle circle-4'></span>
            <span className='circle common-circle-1'></span>
            <span className='circle common-circle-2'></span>
            <span className='circle common-circle-3'></span>

            <form onSubmit={handleSubmit} className='signin'>
                <h4 className='subtitle'>Sign In</h4>
                <input
                    className='inp'
                    placeholder='Enter Your Email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className='inp'
                    placeholder='Enter Your Password'
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <p className='' style={{fontSize:"2.2rem", textAlign:"center"}}>Don't have an account? <a href="/register" style={{padding:"0",backgroundColor:"transparent",color:"#fff", fontSize:"2.3rem", textTransform:"none", boxShadow: "none", margin: "0"}}> Register</a></p>
                <input type='submit' value='Sign In' />
                <div className='line'>
                    <span className='line'> </span>
                </div>
            </form>
        </div>
    );
};

export default Signin;
