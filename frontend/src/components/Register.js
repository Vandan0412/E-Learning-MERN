import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUnlockClick = async (e) => {
        e.preventDefault();
        
        // Basic Validations with Alerts
        if (!formData.username || !formData.firstname || !formData.lastname) {
            alert('All fields are required.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            alert('Please enter a valid email.');
            return;
        }
        if (formData.password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return;
        }
        if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
            alert('Password must include at least one uppercase letter and one number.');
            return;
        }
      

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), // sends form data to backend 
            });
            const data = await response.json();
            if (response.ok) {
                navigate('/login');
            } else {
                alert(data.error || 'An error occurred during registration.');
            }
        } catch (err) {
            alert('An error occurred during registration.');
        }
    };

    return (
        <div className='container register form'>
            <form method='post'>
                <h4 className='subtitle'>Register</h4>
                <div className='inp-box'>
                    <input
                        type='text'
                        placeholder='Username'
                        name='username'
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <input
                        type='text'
                        placeholder='First Name'
                        name='firstname'
                        value={formData.firstname}
                        onChange={handleChange}
                    />
                </div>
                <div className='inp-box'>
                    <input
                        type='text'
                        placeholder='Last Name'
                        name='lastname'
                        value={formData.lastname}
                        onChange={handleChange}
                    />
                    <input
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <input
                    type='text'
                    placeholder='Password'
                    name='password'
                    className='inp'
                    value={formData.password}
                    onChange={handleChange}
                />
                <input
                    type='text'
                    placeholder='Phone Number'
                    name='phone'
                    className='inp'
                    value={formData.phone}
                    onChange={handleChange}
                />
                <p className='' style={{fontSize:"2.2rem", textAlign:"center"}}>Already have an account? <a href="/login" style={{padding:"0",backgroundColor:"transparent",color:"#fff", fontSize:"2.3rem", textTransform:"none", boxShadow: "none", margin: "0"}}> Login</a></p>

                <div className='btn'>
                    <a onClick={handleUnlockClick}>Unlock Your Potential</a>
                </div>
            </form>
        </div>
    );
};

export default Register;
