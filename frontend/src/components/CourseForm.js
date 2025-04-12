import React, { useState } from 'react';
import './CourseForm.css';

const CourseForm = ({ onCourseSubmit }) => {
    const [formData, setFormData] = useState({
        courseName: '',
        courseDescription: '',
        courseMainPicture: null,
        courseMaterial: [],
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            if (name === 'courseMaterial') {
                setFormData((prev) => ({ ...prev, [name]: Array.from(files) })); // Store multiple files
            } else {
                setFormData((prev) => ({ ...prev, [name]: files[0] })); // Store single file
            }
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        console.log(formData)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate image file
        if (formData.courseMainPicture && !formData.courseMainPicture.type.startsWith('image/')) {
            setError('Main picture must be an image file.');
            return;
        }

        // Validate PDFs
        if (formData.courseMaterial.length > 0) {
            for (const file of formData.courseMaterial) {
                if (file.type !== 'application/pdf') {
                    setError('All course materials must be PDF files.');
                    return;
                }
            }
        }

        const data = new FormData();
        data.append('courseName', formData.courseName);
        data.append('courseDescription', formData.courseDescription);
        data.append('courseMainPicture', formData.courseMainPicture);

        // Append multiple PDFs
        formData.courseMaterial.forEach((file) => {
            data.append('courseMaterial', file);
        });

        try {
            const response = await fetch('http://localhost:5000/courses', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.message || 'Failed to submit course');
            }

            const result = await response.json();
            alert('Course submitted successfully');
            onCourseSubmit(result.course); // Notify parent component
            setFormData({
                courseName: '',
                courseDescription: '',
                courseMainPicture: null,
                courseMaterial: [],
            });
        } catch (error) {
            setError('Error submitting course: ' + error.message);
        }
    };

    return (
        <div className='container course-form register form'>
            <form onSubmit={handleSubmit}>
                <h4 className='subtitle'>Course</h4>
                {error && <div className='error-message'>{error}</div>}
                <div className='inp-box'>
                    <label>COURSE NAME:</label>
                    <input
                        type='text'
                        placeholder='Course Name'
                        name='courseName'
                        value={formData.courseName}
                        onChange={handleChange}
                        required
                    />
                    <label>COURSE DESCRIPTION:</label>
                    <textarea
                        placeholder='Course Description'
                        name='courseDescription'
                        value={formData.courseDescription}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <br />
                <div className='inp-box'>
                    <label>COURSE MAIN PICTURE:</label>
                    <input
                        type='file'
                        accept='image/*'
                        name='courseMainPicture'
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='inp-box'>
                    <label>SELECT PDFs:</label>
                    <input
                        type='file'
                        accept='.pdf'
                        name='courseMaterial'
                        onChange={handleChange}
                        multiple
                        required
                    />
                </div>
                <div className='btn'>
                    <button type='submit'>Submit</button>
                </div>
            </form>
        </div>
    );
};

export default CourseForm;
