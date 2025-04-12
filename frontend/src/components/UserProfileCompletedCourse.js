import React from 'react';

const UserProfileCompletedCourse = ({completedCourse}) => {
    return (
        <div className="box-container">
          {completedCourse.map((course) => (
            <div className="box" key={course.c_id}>
              <div className="img">
                <img src={course.c_img} alt={course.c_title} />
              </div>
              <h4>{course.c_title}</h4>
            </div>
          ))}
        </div>
      );
    };
 

export default UserProfileCompletedCourse;