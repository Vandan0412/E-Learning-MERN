import React, { useState } from "react";
import Banner from "./Banner";
import Header from "./Header";
import Footer from "./Footer";
import About from "./About";
import Course from "./Course";
import Contact from "./Contact";
import UserProfile from "./UserProfile";
import ScrollTop from "./ScrollTop";

const Home = () => {
    const [sidebarValue, setSidebarValue] = useState(false);

    return (
        <>
            <Header sidebarValues={{ sidebarValue, setSidebarValue }} />
            <UserProfile sidebarValue={sidebarValue} />
            <Banner />
            <ScrollTop/>
            <Course />
            <About />
            <Contact />
            <Footer />
        </>
    );
};

export default Home;
