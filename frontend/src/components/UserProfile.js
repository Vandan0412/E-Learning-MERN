import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import course1 from '../img/course-1.png';
import UserProfileEnrollCourse from './UserProfileEnrollCourse';
import UserProfileLikedCourse from './UserProfileLikedCourse';
import UserProfileCompletedCourse from './UserProfileCompletedCourse';

const UserProfile = ({ sidebarValue }) => {
    const [session, setSession] = useState(null);
    const [likedCourses, setLikedCourses] = useState([]); // State for liked courses
    const [enrolledCourses, setEnrolledCourses] = useState([]); // State for liked courses

    useEffect(() => {
        // Fetch session data from the backend
        const fetchSession = async () => {
            try {
                const response = await fetch('http://localhost:5000/session', {
                    method: 'GET',
                    credentials: 'include', // Ensure cookies are sent with the request
                });
                if (response.ok) {
                    const data = await response.json();
                    setSession(data.session); // Set session data
                    console.log('Session Data:', data.session); // Log session to the console

                    // Fetch liked courses for the logged-in user
                    fetchLikedCourses(data.session.id);
                    fetchEnrolledCourses(data.session.id);

                } else {
                    console.error('Failed to fetch session');
                }
            } catch (error) {
                console.error('Error fetching session:', error);
            }
        };

        // Fetch session on component mount
        fetchSession();
    }, []);

    // Fetch liked courses from the server
    const fetchLikedCourses = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/user/liked-courses`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                setLikedCourses(data.likedCourses); // Set liked courses
            } else {
                console.error('Failed to fetch liked courses');
            }
        } catch (error) {
            console.error('Error fetching liked courses:', error);
        }
    };
// Fetch enrolled courses from the server for a specific user
const fetchEnrolledCourses = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5000/user/enrolled-courses`, {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            // console.log('Fetched Enrolled Courses:', data.enrolledCourses);
            setEnrolledCourses(data.enrolledCourses); // Ensure it's an array
        } else {
            console.error('Failed to fetch enrolled courses');
        }
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
    }
};



// Enrolled courses are now dynamic, fetched from the server
    const enrolledCourse = enrolledCourses.map(course => ({
        c_id: course._id,
        c_heading: "Enrolled Courses",
        c_img: course.image, // Assuming image is part of the course object
        c_title: course.title,
    }));

    

    // Liked courses are now dynamic, fetched from the server
    const likedCourse = likedCourses.map(course => ({
        c_id: course._id,
        c_heading: "Liked Courses",
        c_img: course.image, // Assuming image is part of the course object
        c_title: course.title,
    }));

    const completedCourse = [
        {
            c_id: "1",
            c_heading: "Completed Courses",
            c_img: course1,
            c_title: "Fundamentals of AI",
        },
        {
            c_id: "2",
            c_heading: "Completed Courses",
            c_img: course1,
            c_title: "Fundamentals of AI",
        },
    ];

    return (
        <div className={sidebarValue ? "user-profile active" : "user-profile"}>
            <div className='sidebar'>
                <div className='user-details'>
                    <div className='user-img'>
                        <img src={require('../img/user-profile.png')} alt="User Profile" />
                    </div>
                    <div className='user-details-box'>
                        {session ? (
                            <>
                                <h4>Username: {session.username}</h4>
                                <h4>Email: {session.email}</h4>
                            </>
                        ) : (
                            <>
                                <h4>Username: Guest</h4>
                                <h4>Email: Guest</h4>
                            </>
                        )}
                    </div>
                </div>
                <span className='line'></span>
                <div className='user-courses'>
                    <h2>Enroll Courses</h2>
                    <UserProfileEnrollCourse enrollCourses={enrolledCourses} />
                    <h2>Liked Courses</h2>
                    <UserProfileLikedCourse likedCourse={likedCourse} />
                   
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
