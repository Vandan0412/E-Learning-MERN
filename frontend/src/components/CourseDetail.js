
import React, { useEffect, useState } from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import "./CourseDetail.css";

const CourseDetail = () => {
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false); // Track enrollment status
     const [isLiked, setIsLiked] = useState(false); 
    const { id } = useParams();
    const navigate = useNavigate();

      // Check if user is logged in
      useEffect(() => {
        fetch('http://localhost:5000/auth/check', { credentials: 'include' }) 
            .then(response => response.json())
            .then(data => {
                if (!data.isAuthenticated) {
                    navigate('/login'); // Redirect to login page if not authenticated
                }
            })
            .catch(error => {
                console.error('Error checking authentication:', error);
                navigate('/login'); // Redirect in case of error
            });
    }, [navigate]);

    // Fetch course details
    useEffect(() => {
        fetch(`http://localhost:5000/courses/${id}`)
            .then(response => response.json())
            .then(data => {
                setCourse(data);
            })
            .catch(error => console.error('Error fetching course data:', error));
    }, [id]);

    // Check enrollment status
    useEffect(() => {
        fetch(`http://localhost:5000/enroll/${id}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.isEnrolled)
                if (data.isEnrolled) {
                    setIsEnrolled(true);
                }else{
                    setIsEnrolled(false)
                }
            })
            .catch(error => console.error('Error checking enrollment status:', error));
    }, [id]);


    const handleEnroll = () => {
        fetch(`http://localhost:5000/enroll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for session
            body: JSON.stringify({ course_id: id}), // Replace "current_user_id" with the logged-in user's ID
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    setIsEnrolled(true); // Update enrollment status
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error enrolling in the course:', error);
                alert('Failed to enroll in the course.');
            });
    };

    const handleUnenroll = () => {
        fetch(`http://localhost:5000/enroll/${id}`, {
            method: 'DELETE',
            credentials: 'include', // Include session cookies
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    setIsEnrolled(false); // Update state after unenrolling
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error unenrolling from the course:', error);
                alert('Failed to unenroll from the course.');
            });
    };
    useEffect(() => {
        fetch(`http://localhost:5000/likes/${id}`, {
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data.isLiked)
                if (data.isLiked) {
                    setIsLiked(true);
                }else{
                    setIsLiked(false)
                }
            })
            .catch(error => console.error('Error checking enrollment status:', error));
    }, [id]);

    
    const handleLike = () => {
        fetch(`http://localhost:5000/likes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for session
            body: JSON.stringify({ course_id: id}), 
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    setIsLiked(true); // Update enrollment status
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error liking the course:', error);
                alert('Failed to like the course.');
            });

      
    };
    const handleUnlike = () => {
        fetch(`http://localhost:5000/likes/${id}`, {
            method: 'DELETE',
            credentials: 'include', // Include session cookies
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    setIsLiked(false); // Update state after unenrolling
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error unliking  this course:', error);
                alert('Failed to unliking  this course.');
            });
    };
    
    

    

    if (!course) {
        return <div>Loading...</div>;
    }

    const containerStyle = {
        backgroundColor: "var(--bg-color)",
        minHeight: "100vh",
        padding: "10rem 8rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
    };
    const content = {
        position: "relative",
        zIndex: "2",
        backgroundColor: "rgba(0,0,0,.5)",
        borderTopLeftRadius: "5rem",
        borderBottomLeftRadius: "5rem",
        padding: "3rem",
        transform: "translateX(5rem)",
    };
    const para = {
        color: "#dcdcdc",
        fontSize: "1.8rem",
        padding: "2rem 0",
    };
    const buttonStyle = {
        backgroundColor: "#082c3e",
        fontSize: "2.3rem",
        color: "#0AB3FF",
        padding: "2rem 4rem",
        boxShadow: "0 0 4rem rgb(30, 85, 112)",
        transition: "all .3s ease-in",
        marginTop: "3rem",
        display: "inline-block",
        borderRadius: "5rem",
        width: "15rem",
        textAlign: "center",
        marginRight: "2rem",
        cursor: "pointer",
    };
    const imgStyle = {
        width: "100%",
        position: "relative",
        zIndex: "2",
        border: "1rem solid #b3e2f8",
        backgroundColor: "#70a0b9",
        transform: "translateX(-7rem)",
        padding: "2rem",
        borderRadius: "5rem",
    };
   
    return (
        <div className="container course-detail" style={containerStyle}>
              <span className='circle circle-1' style={{ zIndex: "1", right: "10rem", top: "2.5%", width: "95rem", height: "95rem" }}></span>
            <span className='circle circle-2' style={{ zIndex: "1", right: "15rem", top: "7%", width: "85rem", height: "85rem" }}></span>
            <span className='circle circle-3' style={{ zIndex: "1", right: "20rem", top: "12%", width: "75rem", height: "75rem" }}></span>
            <span className='circle circle-4' style={{ zIndex: "1", left: "-45rem", top: "3%", width: "90rem", height: "90rem" }}></span>
            <span className='circle circle-5' style={{ zIndex: "1", left: "-40rem", top: "8%", width: "80rem", height: "80rem" }}></span>
            <span className='circle circle-6' style={{ zIndex: "1", left: "-35rem", top: "13%", width: "70rem", height: "70rem" }}></span>
            <span className='circle circle-7' style={{ zIndex: "1", right: "-36.35rem", top: "-36.35%", width: "70rem", height: "70rem" }}></span>
            <span className='circle circle-8' style={{ zIndex: "1", right: "-39.6rem", top: "-39.6%", width: "70rem", height: "70rem", backgroundColor: "rgba(30, 30, 30,.8)" }}></span>
            <span className='circle square' style={{ zIndex: "1", left: "25rem", top: "50%", transform: "translateY(-50%)", width: "70%", height: "50rem", backgroundColor: "#15698f", borderRadius: "5rem"}}></span>
            <span className='circle common-circle-1'></span>
            <span className='circle common-circle-2'></span>
            <span className='circle common-circle-3'></span>

            <div className='row'>
                <div className='col'>
                    <div className='content' style={content}>
                        <h4 className="course-name">{course.title}</h4>
                        <p style={para}>{course.description}</p>
                        <button 
        style={buttonStyle} 
        onClick={isEnrolled ? handleUnenroll : handleEnroll}
    >
        {isEnrolled ? 'Unenroll' : 'Enroll'}
    </button>
                        {isEnrolled && (
                            <a href={`/subject/${id}`} style={buttonStyle}>
                                Notes
                            </a>
                        )}
                      <button 
    style={buttonStyle} 
    onClick={isLiked ? handleUnlike : handleLike}
>
    {isLiked ? 'Unlike' : 'Like'}
</button>

                    </div>
                </div>
                <div className='col'>
                    <div className='img'>
                        <img src={course.image} style={imgStyle} alt={course.title} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetail;

