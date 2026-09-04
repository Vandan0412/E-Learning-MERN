// Replace all import statements with require
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const OpenAI = require('openai');
const dotenv = require('dotenv');

const app = express();

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

const MONGODB_URI = "mongodb://mongodb:27017/E-Learning";

// MongoDB connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// MongoDB schemas
const QuizSchema = new mongoose.Schema({
    topic: String,
    subtopic: String,
    difficulty: String,
    questions: Array,
    createdAt: { type: Date, default: Date.now },
});

const Quiz = mongoose.model('Quiz', QuizSchema);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to shuffle answer options and adjust correctAnswer index
function randomizeAnswers(question) {
    const originalOptions = [...question.options];
    const originalCorrectIndex = question.correctAnswer;
    const correctOption = originalOptions[originalCorrectIndex];
    
    // Shuffle the options array
    const shuffledOptions = [];
    const optionIndices = [...originalOptions.keys()];
    
    while (optionIndices.length > 0) {
        const randomIndex = Math.floor(Math.random() * optionIndices.length);
        const optionIndex = optionIndices.splice(randomIndex, 1)[0];
        shuffledOptions.push(originalOptions[optionIndex]);
    }
    
    // Find the new position of the correct answer
    const newCorrectIndex = shuffledOptions.indexOf(correctOption);
    
    return {
        ...question,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex
    };
}

// Generate quiz endpoint
app.post('/api/generate-quiz', async (req, res) => {
    try {
        const { topic, subtopic, difficulty, questionCount } = req.body;
        
        // Check cache
        const cachedQuiz = await Quiz.findOne({
            topic,
            subtopic,
            difficulty,
            createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });
        
        if (cachedQuiz) {
            console.log('Using cached quiz');
            // Randomize answers for cached questions
            const randomizedQuestions = cachedQuiz.questions
                .slice(0, questionCount)
                .map(q => randomizeAnswers(q));
            
            return res.json(randomizedQuestions);
        }
        
        console.log('Generating new quiz with OpenAI');
        // Generate new quiz
        const prompt = `Generate ${questionCount} multiple-choice questions about ${topic}, focusing specifically on ${subtopic} at a ${difficulty} level. 
        Format the response as a JSON array with each object having these properties:
        - "question": the question text
        - "options": array of 4 possible answers
        - "correctAnswer": index of the correct answer (0-3)
        - "explanation": brief explanation of why this is the correct answer
        
        Make sure each question has exactly 4 options.`;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `You are a quiz generator specializing in ${topic}, particularly ${subtopic}. Generate clear, accurate multiple-choice questions with one definitively correct answer.`
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });
        
        const contentText = completion.choices[0].message.content;
        const cleanedContentText = contentText.replace(/```json|```/g, '').trim();
        
        let questions;
        try {
            questions = JSON.parse(cleanedContentText);
            
            // Validate the format of each question
            questions = questions.map(q => ({
                question: q.question,
                options: q.options || [],
                correctAnswer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
                explanation: q.explanation || "No explanation provided."
            }));
            
            // Randomize the answer options for each question
            questions = questions.map(q => randomizeAnswers(q));
            
        } catch (parseError) {
            console.error('Error parsing OpenAI response:', parseError);
            throw new Error('Failed to parse quiz data');
        }
        
        // Cache the questions
        await Quiz.create({
            topic,
            subtopic,
            difficulty,
            questions,
        });
        
        res.json(questions); // Return the questions as JSON
    } catch (error) {
        console.error('Quiz generation error:', error);
        res.status(500).json({ error: 'Failed to generate quiz' });
    }
});

// New endpoint to check answers
app.post('/api/check-answers', async (req, res) => {
    try {
        const { questions, userAnswers } = req.body;
        
        const results = questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.correctAnswer;
            return {
                isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            };
        });
        
        const score = results.filter(r => r.isCorrect).length;
        
        res.json({
            results,
            score,
            total: questions.length
        });
    } catch (error) {
        console.error('Answer checking error:', error);
        res.status(500).json({ error: 'Failed to check answers' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});