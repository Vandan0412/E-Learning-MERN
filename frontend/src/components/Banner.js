import React from 'react';
import './Banner.css'

const Banner = () => {
    return(

        <div className='container banner'>
            <span className='circle circle-1'></span>
            <span className='circle circle-2'></span>
            <span className='circle circle-3'></span>
            <span className='circle circle-4'></span>
            <span className='circle circle-5'></span>
            <span className='circle common-circle-1'></span>
            <span className='circle common-circle-2'></span>
            <span className='circle common-circle-3'></span>
            <div className='row'>
                <div className='col'>
                    <div className='content'>
                        <h2>THE BEST <span>MODERNIZED EDUCATION </span>   WEBSITE FOR LEARNERS</h2>
                        <p>Welcome to the future of learning! Our platform combines advanced AI with personalized learning experiences, offering interactive courses designed to boost your skills. With features like tailored course, automatic quiz grading and content scrapping in an In APP Academic Voice Assistant , we make learning engaging and efficient. Join a vibrant community where education meets innovation, and unlock your full potential today</p>
                    </div>
                </div>
                <div className='img'>
                    <img src={require('../img/home-1.png')} alt="Home" />
                    <img src={require('../img/home-1.png')} alt="Home" />
                    <img src={require('../img/home-1.png')} alt="Home" />
                    <span className='bg'></span>
                </div>
            </div>
            <a href="#course"className='lines'>
                <span></span>
                <span></span>
            </a>
        </div>

    )
}
export default Banner;