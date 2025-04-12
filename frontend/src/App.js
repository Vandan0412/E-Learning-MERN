import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Signin from './components/Signin';
import Home from './components/Home'; // Import Home page
import CourseAdmin from './components/CourseAdmin'; 
import Subject from './components/Subject'; 
import CourseDetail from './components/CourseDetail'; 
import CourseForm from './components/CourseForm';
import TextToSpeech from './components/TextToSpeech';
import AiQuizGenerator from './components/AiQuizGenerator';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} /> {/* Set Home page as default */}
                <Route path="/home" element={<Home />} /> {/* Add /home route */}
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Signin />} />
                <Route path="/course-admin" element={<CourseAdmin />} />
                <Route path="/subject/:id" element={<Subject />} />
                <Route path="/course-detail/:id" element={<CourseDetail />} /> {/* Updated route */}
                <Route path="/course-form" element={<CourseForm />} />
                <Route path="/tts" element={<TextToSpeech />} />
                <Route path="/Quiz" element={<AiQuizGenerator />} />
            </Routes>
        </Router>
    );
}

export default App;
