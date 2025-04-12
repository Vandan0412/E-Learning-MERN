import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        queryType: 'technical',
        description: '',
    });
    const [message, setMessage] = useState(''); // For showing submission response messages

    // Handle form input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Thank you for your valuable feedback, We will contact you shortly.'); // Success message
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    queryType: 'technical',
                    description: '',
                });
            } else {
                setMessage(data.error || 'An error occurred while submitting the form.');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setMessage('An error occurred while submitting the form.');
        }
    };

    return (
        <div className="container contact common-circle-container" id="contact">
            <span className="mid-line"></span>
            <span className="circle circle-1"></span>
            <span className="circle circle-2"></span>
            <span className="circle circle-3"></span>
            <span className="circle circle-4"></span>
            <span className="circle circle-5"></span>
            <span className="circle common-circle-1"></span>
            <span className="circle common-circle-2"></span>
            <span className="circle common-circle-3"></span>
            <span className="circle circle-6 blur"></span>
            <span className="circle circle-7 blur"></span>

            <div className="section-header">
                <h2>Contact Us</h2>
                <span className="underline"></span>
            </div>
            <div className="row">
                <div className="col">
                    <p>
                        We’d love to hear from you! Whether you have questions, feedback, or need assistance, our team is here to help. 
                        Please feel free to reach out through any of the following channels: General Inquiries For general questions about our platform, services, or features.
                    </p>
                </div>
                <div className="col">
                    <form onSubmit={handleSubmit}>
                        <h4 className="subtitle">Contact</h4>
                        <div className="inp-box">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                className="inp"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                className="inp"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            className="inp"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <div className="dropdown">
                            <select
                                name="queryType"
                                className="inp"
                                value={formData.queryType}
                                onChange={handleChange}
                            >
                                <option value="technical">Technical</option>
                                <option value="account">Account</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <textarea
                            name="description"
                            placeholder="Description"
                            className="inp"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>

                       {/* Display submission status message above submit */}
                       {message && <div className={`form-message ${message.includes('error') ? 'error' : 'success'}`}>{message}</div>}

                        <input type="submit" value="Submit" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
