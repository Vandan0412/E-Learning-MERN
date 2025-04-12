const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
// const upload = multer({ dest: 'uploads/' });

const app = express();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname); // Keeping original file name with timestamp
    }
});

const upload = multer({ storage });

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// Session Configuration
app.use(
    session({
        secret: 'yourSecretKey',
        resave: false,
        rolling: true, 
        saveUninitialized: false,
        cookie: {
            secure: false,
            httpOnly: true,
            maxAge:  24 * 1000 * 60 * 60, // 1 hour
        },
    })
);

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/E-Learning',  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Database connection successful'))
.catch(err => console.error('Database connection error:', err));

// Schemas and Models
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    phone: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    queryType: { type: String, required: true },
    description: { type: String, required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    instructor: { type: String, required: true },
    materials: { type: [String], required: true },
});

const Course = mongoose.model('Course', courseSchema);

const likeSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
}, { timestamps: true });

const Likes = mongoose.model('Likes', likeSchema);


const enrollSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }
});

const Enroll = mongoose.model('Enroll', enrollSchema);


// Routes

// User Registration
app.post('/register', async (req, res) => {
    const { username, email, password, firstname, lastname, phone } = req.body;

    if (!username || !email || !password || !firstname || !lastname) {
        return res.status(400).send({ error: 'All fields are required.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword, firstname, lastname, phone });
        await user.save();// store in mongodddb
        req.session.user = { id: user._id, username: user.username, email: user.email };
        res.status(201).send({ message: 'User registered successfully!', user: req.session.user });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send({ error: 'Email already exists.' });
        }
        res.status(500).send({ error: 'Error registering user: ' + err.message });
    }
});

// User Login
app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ error: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid credentials.' });
        }

        req.session.user = { id: user._id, username: user.username, email: user.email };
        res.status(200).send({ message: 'Login successful', user: req.session.user });
    } catch (err) {
        res.status(500).send({ error: 'Error logging in: ' + err.message });
    }
});

// Check Session
app.get('/session', (req, res) => {
    if (req.session.user) {
        res.status(200).send({ session: req.session.user });
    } else {
        res.status(401).send({ error: 'No active session.' });
    }
});

// User Logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error destroying session.');
        }
        res.status(200).send('Logged out.');
    });
});

// Contact Form Submission
app.post('/contact', async (req, res) => {
    const { name, email, phone, queryType, description } = req.body;

    if (!name || !email || !phone || !queryType || !description) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const contact = new Contact({ name, email, phone, queryType, description });
        await contact.save();
        res.status(201).json({ message: 'Form submitted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

app.get('/auth/status', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ isLoggedIn: true });
    } else {
        res.json({ isLoggedIn: false });
    }
});


// Course Submission
app.post('/courses', upload.fields([
    { name: 'courseMainPicture', maxCount: 1 },
    { name: 'courseMaterial', maxCount: 5 },
]), async (req, res) => {
    const { courseName, courseDescription } = req.body;
    const courseMainPicture = req.files['courseMainPicture']?.[0];
    const courseMaterials = req.files['courseMaterial']?.map(file => 
        `http://localhost:5000/uploads/${file.filename}`
    );

    if (!courseName || !courseDescription || !courseMainPicture || !courseMaterials) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const courseMainPictureUrl = `http://localhost:5000/uploads/${courseMainPicture.filename}`;

    try {
        const course = new Course({
            title: courseName,
            description: courseDescription,
            image: courseMainPictureUrl,
            instructor: 'Course_admin',
            materials: courseMaterials,
        });

        await course.save();
        res.status(201).json({ message: 'Course added successfully.', course });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});


// Get All Courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});

// Get Course by ID
app.get('/courses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ error: 'Course not found.' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});


// likes
const authenticate = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    next();
};

app.get('/auth/check', (req, res) => {
    if (req.session.user) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});



// Route to fetch user's enrolled courses
app.get('/user/enrolled-courses', authenticate, async (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Find all enrolled courses for this user and populate course details
        const EnrollCourses = await Enroll.find({ user_id: user.id })
            .populate('course_id') // Populate the course details using course_id reference
            .exec();
        // Extract full course details
        const courses = EnrollCourses.map(enroll => enroll.course_id);

        res.status(200).json({ enrolledCourses: courses }); // Send full course details
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ message: 'Internal Server Error: ' + error.message });
    }
});
app.get('/user/liked-courses', authenticate, async (req, res) => {
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        // Find all liked courses for this user and populate course details
        const likedCourses = await Likes.find({ user_id: user.id })
            .populate('course_id') // Populate course details using course_id reference
            .exec();

        // Extract full course details
        const courses = likedCourses.map(like => like.course_id);

        res.status(200).json({ likedCourses: courses }); // Send full course details
    } catch (error) {
        console.error('Error fetching liked courses:', error);
        res.status(500).json({ message: 'Internal Server Error: ' + error.message });
    }
});




app.get('/likes/:id', async (req, res) => {
    const user = req.session.user; // Replace this with session-based or token-based user authentication

    if (!user.id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {

        // Find enrollment based on course_id and user_id
        const isLiked = await Likes.findOne({ course_id: req.params.id, user_id: user.id });
        
        if (isLiked) {
            return res.json({ isLiked: true });
        } else {
            return res.json({ isLiked: false });
        }
    } catch (error) {
        // Handle any server-side errors
        console.error('Error checking liked:', error);
        res.status(500).json({ message: 'Error checking liked', error });
    }
});


app.post('/likes', async (req, res) => {
    const { course_id } = req.body;
    const user = req.session.user; // Replace with your session management logic

    if (!user || !user.id) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }

    try {
        // Check if user is already enrolled
        const existingLike = await Likes.findOne({ course_id, user_id: user.id });

        if (existingLike) {
            // Unenroll (delete record)
            await Likes.deleteOne({ course_id, user_id: user.id });
            return res.json({ success: true, message: 'Successfully Unliked this course' });
        } else {
            // Enroll (create new record)
            const newLike = new Likes({ course_id, user_id: user.id });
            await newLike.save();
            return res.json({ success: true, message: 'Successfully Liked this course' });
        }
    } catch (error) {
        console.error('Error toggling Liking:', error);
        res.status(500).json({ message: 'Error processing Liking', error });
    }
});



app.get('/enroll/:id', async (req, res) => {
    const user = req.session.user; // Replace this with session-based or token-based user authentication

    if (!user.id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {

        // Find enrollment based on course_id and user_id
        const isEnrolled = await Enroll.findOne({ course_id: req.params.id, user_id: user.id });
        
        if (isEnrolled) {
            return res.json({ isEnrolled: true });
        } else {
            return res.json({ isEnrolled: false });
        }
    } catch (error) {
        // Handle any server-side errors
        console.error('Error checking enrollment:', error);
        res.status(500).json({ message: 'Error checking enrollment', error });
    }
});

app.delete('/likes/:course_id', async (req, res) => {
    const { course_id } = req.params;
    const user = req.session.user; // Get user from session

    if (!user || !user.id) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }

    try {
        // Find and remove the like record
        const unlike = await Likes.findOneAndDelete({ course_id, user_id: user.id });

        if (!unlike) {
            return res.status(400).json({ message: 'You have not like this course' });
        }

        res.json({ success: true, message: 'Successfully unliked this course' });
    } catch (error) {
        console.error('Error unlike from course:', error);
        res.status(500).json({ message: 'Error unlike from course', error });
    }
});



app.post('/enroll', async (req, res) => {
    const { course_id } = req.body;
    const user = req.session.user; // Replace with your session management logic

    if (!user || !user.id) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }

    try {
        // Check if user is already enrolled
        const existingEnroll = await Enroll.findOne({ course_id, user_id: user.id });

        if (existingEnroll) {
            // Unenroll (delete record)
            await Enroll.deleteOne({ course_id, user_id: user.id });
            return res.json({ success: true, message: 'Successfully unenrolled from the course' });
        } else {
            // Enroll (create new record)
            const newEnroll = new Enroll({ course_id, user_id: user.id });
            await newEnroll.save();
            return res.json({ success: true, message: 'Successfully enrolled in the course' });
        }
    } catch (error) {
        console.error('Error toggling enrollment:', error);
        res.status(500).json({ message: 'Error processing enrollment', error });
    }
});
app.delete('/enroll/:course_id', async (req, res) => {
    const { course_id } = req.params;
    const user = req.session.user; // Get user from session

    if (!user || !user.id) {
        return res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }

    try {
        // Find and remove the enrollment record
        const deletedEnroll = await Enroll.findOneAndDelete({ course_id, user_id: user.id });

        if (!deletedEnroll) {
            return res.status(400).json({ message: 'You are not enrolled in this course' });
        }

        res.json({ success: true, message: 'Successfully unenrolled from the course' });
    } catch (error) {
        console.error('Error unenrolling from course:', error);
        res.status(500).json({ message: 'Error unenrolling from course', error });
    }
});


app.get('/pdf/note.pdf', (req, res) => {
    const filePath = path.join(__dirname, 'pdf', 'note.pdf'); // Path to your PDF file
    console.log(filepath)
    res.download(filePath, 'note.pdf', (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(500).send('Error downloading file');
        }
    });
});





// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));