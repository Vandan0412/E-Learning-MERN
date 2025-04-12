import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const UserProfileEnrollCourse = ({ enrollCourses }) => {
  console.log(enrollCourses);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // Handlers for Previous and Next buttons
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <div className="box-container">
      {/* Previous Arrow */}
      <button className="embla__button embla__button--prev" onClick={scrollPrev}>
        ‹
      </button>

      {/* Embla Carousel */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {enrollCourses.map((course) => (
            <div className="embla__slide" key={course._id}>
              <a  href={`course-detail/${course._id}`} className="box">
                <div className="img">
                  <img src={course.image} alt={course.title} />
                </div>
                <h4>{course.title}</h4>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Next Arrow */}
      <button className="embla__button embla__button--next" onClick={scrollNext}>
        ›
      </button>
    </div>
  );
};

export default UserProfileEnrollCourse;
