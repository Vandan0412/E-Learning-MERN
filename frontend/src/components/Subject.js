import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Subject.css';

function Subject() {
    const { id } = useParams(); // Get course ID from URL
    const [course, setCourse] = useState(null);
    const [error, setError] = useState('');

    const [activeIndexes, setActiveIndexes] = useState([]);
    const [isQuizActive, setIsQuizActive] = useState(false);

    const handlePdfClick = (index) => {
        setActiveIndexes((prev) => [...prev, index]);
    };

    const handleQuizClick = () => {
        setIsQuizActive(true);
    };



    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:5000/courses/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch course details');
                }
                const data = await response.json();
                setCourse(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCourse();
    }, [id]);

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!course) {
        return <div>Loading...</div>;
    }

    return (
        <div className='course-overview'>
            <span className='circle circle-1'></span>
            <span className='circle circle-2'></span>
            <span className='circle circle-3'></span>
            <span className='circle circle-4'></span>
            <span className='circle circle-5'></span>
            <span className='circle common-circle-1'></span>
            <span className='circle common-circle-2'></span>
            <span className='circle common-circle-3'></span>

            <div className='course-overview-header'>
                <h1>{course.title} </h1>
            </div>

            <div className='box-container'>
                {course.materials && course.materials.map((pdfUrl, index) => (
                    <div key={index} className={`box ${index % 2 === 0 ? 'left' : 'right'}`}>
                        <div className={`line line-${index + 1} ${activeIndexes.includes(index) ? 'active' : ''}`}></div>
                        <a href={pdfUrl} target="_blank" rel="noopener noreferrer"  onClick={() => handlePdfClick(index)}>Chapter {index + 1}</a>
                    </div>
                ))}
            </div>

            <div className='quiz-btn'onClick={handleQuizClick}>
                <a href="/Quiz">    QUIZ</a>
            </div>

            <div className={`line line-5 ${isQuizActive ? 'active' : ''}`}></div>
        </div>
    );
}

export default Subject;
