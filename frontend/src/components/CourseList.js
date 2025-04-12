import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';

const CourseList = ({ courseDetails }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

    // Handlers for Previous and Next buttons
    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);
    
    return (
        <div className="embla">
            {/* Previous Button */}
            <button className="embla__button embla__button--prev" onClick={scrollPrev}>
                ‹
            </button>

            {/* Slider Container */}
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {courseDetails.map((course) => (
                        <div className="embla__slide"  key={course._id}>
                            <a href={`/course-detail/${course._id}`} className="box">
                                <img src={course.image} alt={course.title} />
                                <div className="text">
                                    <p>{course.title}</p>
                                </div>
                                <span className="line"></span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            {/* Next Button */}
            <button className="embla__button embla__button--next" onClick={scrollNext}>
                ›
            </button>
        </div>
    );
};

export default CourseList;
