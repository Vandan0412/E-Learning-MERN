import React, { useEffect, useState } from 'react';
import './Course.css';
import CourseList from './CourseList';
import course1Image from '../img/course-1.png';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

const Course = () => {
    const [courseDetails, setCourseDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/courses');
                if (!response.ok) {
                    throw new Error('Failed to fetch courses');
                }
                const data = await response.json();
                setCourseDetails(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className='container course common-circle-container' id='course'>
            <span className='circle circle-1'></span>
            <span className='circle circle-2'></span>
            <span className='circle circle-3'></span>
            <span className='circle circle-4'></span>
            <span className='circle circle-5'></span>
            <span className='circle common-circle-1'></span>
            <span className='circle common-circle-2'></span>
            <span className='circle common-circle-3'></span>
            <div className='section-header'>
                <h2>COURSES</h2>
                <span className='underline'></span>
            </div>
            <div className='row'>
                <div className='box-container'>
                    <CourseList courseDetails={courseDetails} />
                </div>
            </div>
            <a href="#about" className='lines'>
                <span></span>
                <span></span>
            </a>
        </div>
    );
};

export default Course;
