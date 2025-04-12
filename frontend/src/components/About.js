import React from 'react';
import './About.css';


const About = () => {
    return(
        <div  className='about container common-circle-container' id='about'>
            <span className='circle circle-1'></span>
            <span className='circle circle-2'></span>
            <span className='circle circle-3'></span>
            <span className='circle circle-4'></span>
            <span className='circle circle-5'></span>
            <span className='circle common-circle-1'></span>
            <span className='circle common-circle-2'></span>
            <span className='circle common-circle-3'></span>
            <span className='circle circle-6 blur'></span>
           <div className='section-header'>
                <h2>ABOUT US</h2>
                <span className='underline'></span>
           </div>
           <div className='row '>
                <div className='col'>
                    <div className='content'>
                        <div className='box'>
                        < h4 className='subtitle'>WHAT WE DO</h4>

                            <p>Welcome to the future of learning! Our platform combines advanced AI with personalized learning experiences, offering interactive courses designed to boost your skills. With features like tailored course, automatic quiz grading and content scrapping along with  real-time progress tracking, we make learning engaging and efficient. Join a vibrant community where education meets innovation, and unlock your full potential today</p>

                        </div>
                        
                    </div>
                </div>
                <div className='col'>
                    <div className='img'>
                        <img src={require('../img/about-1.png')} alt="about" />
                    </div>
                </div>
           </div>
           <a href="#contact"className='lines'>
                <span></span>
                <span></span>
           </a>
        </div>

    )
}
export default About;