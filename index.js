require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const { resolve } = require('path');

const app = express();
const port = process.env.PORT || 3010;
const MONGO_URI = process.env.MONGO_URI;

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to serve static files
app.use(express.static('static'));

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) =>
    console.error(`❌ Error connecting to database: ${err.message}`)
  );

// Define Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// 🟢 API to Insert Data into MongoDB
app.post('/add-user', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    res
      .status(201)
      .json({ message: '✅ User added successfully!', user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: '❌ Error adding user', details: error.message });
  }
});

// Default route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
