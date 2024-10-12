require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000; // or your preferred port

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User Schema and Model
const userSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Register User
app.post('/register', async (req, res) => {
    const { studentName, password } = req.body;

    try {
        const newUser = new User({
            studentName,
            password // Store password in plain text for testing
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error });
    }
});

// Login User
app.post('/login', async (req, res) => {
    const { username, password } = req.body; // Corrected to use 'studentName'

    try {
        // Log the studentName being searched
        console.log("Searching for user:", username);

        // Find user in DB by username
        const user = await User.findOne({ username }); // Ensure 'studentName' matches your database
        console.log("User found:", user); // Log the found user

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare password with the stored password (plain text)
        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If authentication is successful, send a success message
        res.json({ message: 'Login successful' });

    } catch (error) {
        console.error("Error during login:", error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error });
    }
});



// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
