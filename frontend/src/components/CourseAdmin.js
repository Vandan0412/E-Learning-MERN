import React, { useState } from 'react';
import './CourseAdmin.css';
import CourseForm from './CourseForm';
import logout from '../img/logout.png';

const CourseAdmin = () => {
    const [submittedCourses, setSubmittedCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleCourseSubmit = (newCourse) => {
        setSubmittedCourses((prev) => [...prev, newCourse]);
        setSuccessMessage('Course submitted successfully!');
        setIsLoading(false);
    };

    return (
        <div className='admin course-admin container'>
            <div className='header'>
                <div className='name'>Admin</div>
                <button>
                    <img src={logout} alt='Logout' />
                </button>
            </div>
            <div className='main-content'>
                <CourseForm onCourseSubmit={handleCourseSubmit} />
                {isLoading && <div className='loading'>Submitting course...</div>}
                {successMessage && <div className='success-message'>{successMessage}</div>}
                <h2>Submitted Courses</h2>
                <ul>
                    {submittedCourses.map((course, index) => (
                        <li key={index}>
                            <h3>{course.title}</h3>
                            <p>{course.description}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CourseAdmin;