import React, { useState, useEffect } from 'react';
import './Quiz.css';

const AiQuizGenerator = () => {
  // Define subtopics for each main topic
  const topicSubtopics = {
    "Network Security Management": [
      "Firewall Configuration",
      "Intrusion Detection Systems",
      "VPN Technologies",
      "Network Monitoring",
      "Security Policies",
      "Threat Analysis",
      "Vulnerability Assessment",
      "Incident Response"
    ],
    "Fundamentals of AI": [
      "Machine Learning Basics",
      "Neural Networks",
      "Natural Language Processing",
      "Computer Vision",
      "Reinforcement Learning",
      "AI Ethics",
      "Knowledge Representation",
      "Expert Systems"
    ],
    "Java": [
      "Object-Oriented Programming",
      "Exception Handling",
      "Collections Framework",
      "Multithreading",
      "Stream API",
      "JDBC",
      "Java GUI (Swing/JavaFX)",
      "Servlets and JSP"
    ],
    "MERN stack": [
    "Introduction to MERN Stack",
    "MongoDB Basics",
    "Schema Design in MongoDB",
    "Express.js Fundamentals",
    "Routing in Express.js",
    "RESTful APIs with Express",
    "React Basics",
    "React Hooks",
    "Component Lifecycle in React",
    "State Management in React",
    "React Router",
    "Redux with React",
    "Node.js Basics",
    ]
  };

  // State variables (must come before useEffect)
  const [topic, setTopic] = useState("Network Security Management");
  const [subtopic, setSubtopic] = useState(topicSubtopics["Network Security Management"][0]);
  const [difficulty, setDifficulty] = useState("Beginner");
  const [questionCount, setQuestionCount] = useState("5")
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 });

  // Update subtopic when topic changes
  useEffect(() => {
    if (topicSubtopics[topic]) {
      setSubtopic(topicSubtopics[topic][0]);
    }
  }, [topic]);

  const handleGenerateQuiz = async () => {
    setLoading(true);
    setError("");
    setCurrentQuestions([]);
    setUserAnswers([]);
    setSubmitted(false);

    try {
      const response = await fetch('http://localhost:3001/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          subtopic,
          difficulty,
          questionCount: parseInt(questionCount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const questions = await response.json();
      setCurrentQuestions(questions);
    } catch (error) {
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex, optionIndex) => {
    if (submitted) return;
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const resetQuizAnswers = () => {
    setUserAnswers([]);
    setSubmitted(false);
  };

  const evaluateQuiz = () => {
    const answeredCount = userAnswers.filter(answer => answer !== undefined).length;
    if (answeredCount < currentQuestions.length) {
      alert(`Please answer all questions before submitting. You have answered ${answeredCount} of ${currentQuestions.length} questions.`);
      return;
    }

    let correct = 0;
    const total = currentQuestions.length;
    currentQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });

    setScore({
      correct,
      total,
      percentage: Math.round((correct / total) * 100)
    });

    setSubmitted(true);
  };

  return (
    <div className="quiz-body">
      <div className="quiz-container">
        <h1 className="quiz-title">ACADEMIC QUIZ </h1>

        <div className="quiz-form">
          <div className="form-group">
            <label className="form-label">Topic</label>
            <div className="select-container">
              <select 
                className="select-input"
                value={topic} 
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="Network Security Management">Network Security Management</option>
                <option value="Fundamentals of AI">Fundamentals of AI</option>
                <option value="Java">Java</option>
                <option value="MERN stack">Emerging Trends & Technology</option>
              </select>
              <div className="select-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subtopic</label>
            <div className="select-container">
              <select 
                className="select-input"
                value={subtopic} 
                onChange={(e) => setSubtopic(e.target.value)}
              >
                {topicSubtopics[topic]?.map((sub, index) => (
                  <option key={index} value={sub}>{sub}</option>
                ))}
              </select>
              <div className="select-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty</label>
            <div className="select-container">
              <select 
                className="select-input"
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <div className="select-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Number Of Questions</label>
            <div className="select-container">
              <select 
                className="select-input"
                value={questionCount} 
                onChange={(e) => setQuestionCount(e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
              <div className="select-arrow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6L8 10L12 6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <button 
            className="btn btn-primary"
            onClick={handleGenerateQuiz}
            disabled={loading}
          >
            Generate Quiz
          </button>
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <h1>Generating your quiz...</h1>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        {currentQuestions.length > 0 && (
          <div>
            {currentQuestions.map((question, qIndex) => (
              <div key={qIndex} className="question-card">
                <h3 className="question-title">{qIndex + 1}. {question.question}</h3>
                <div>
                  {question.options.map((option, optIndex) => (
                    <div 
                      key={optIndex} 
                      className={`option-container ${submitted && question.correctAnswer === optIndex ? 'correct' : ''} ${submitted && userAnswers[qIndex] === optIndex && question.correctAnswer !== optIndex ? 'incorrect' : ''}`}
                    >
                      <input 
                        type="radio" 
                        id={`q${qIndex}-opt${optIndex}`} 
                        name={`question${qIndex}`} 
                        value={optIndex}
                        className="option-radio"
                        checked={userAnswers[qIndex] === optIndex}
                        onChange={() => handleAnswerChange(qIndex, optIndex)}
                        disabled={submitted}
                      />
                      <label 
                        htmlFor={`q${qIndex}-opt${optIndex}`} 
                        className="option-label"
                        onClick={() => handleAnswerChange(qIndex, optIndex)}
                      >
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                {submitted && (
                  <div 
                    className={`feedback ${userAnswers[qIndex] === question.correctAnswer ? 'correct' : 'incorrect'}`}
                  >
                    {userAnswers[qIndex] === question.correctAnswer 
                      ? `Correct! ${question.explanation}` 
                      : `Incorrect. The correct answer is: ${question.options[question.correctAnswer]}. ${question.explanation}`
                    }
                  </div>
                )}
              </div>
            ))}

            <div className="button-container">
              <button 
                className="btn btn-secondary"
                onClick={resetQuizAnswers}
              >
                Reset Answers
              </button>
              <button 
                className="btn btn-primary"
                onClick={evaluateQuiz}
                disabled={submitted}
              >
                Submit Quiz
              </button>
            </div>

            {submitted && (
              <div className="quiz-score">
                Your score: {score.correct}/{score.total} ({score.percentage}%)
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiQuizGenerator;
