import React from "react";
import './ScrollTop.css';

const ScrollTop = () => {
   
    const handleScrollTop = () => {
        window.scrollTo(0,0);
    }
    window.addEventListener("scroll", () => {
        if(window.scrollY > "200"){
            document.querySelector(".scroll-top").classList.add("active");
        }else{
            document.querySelector(".scroll-top").classList.remove("active");
        }
    })
    return(
        <button className="scroll-top" onClick={handleScrollTop}>
            <span className="line"></span>
            <span className="circle"></span>
            <span className="oval"></span>
        </button>
    )

}

export default ScrollTop;