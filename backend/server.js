const express = require('express'); 
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// User model
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
});

const User = mongoose.model('User', UserSchema);

// API route to register a new user
app.post('/api/register', async (req, res) => {
  const { username, email } = req.body;

  // Check for missing fields
  if (!username || !email) {
    return res.status(400).json({ message: 'Please provide both username and email.' });
  }

  try {
    const newUser = new User({ username, email });
    await newUser.save();
    res.json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// API route to get all users from the database
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();  // Fetch all users from the database
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

// API route to delete a user by ID
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

// API route to update a user by ID
app.put('/api/users/:id', async (req, res) => {
  const { username, email } = req.body;
  const userId = req.params.id;

  // Check for missing fields
  if (!username || !email) {
    return res.status(400).json({ message: 'Please provide both username and email.' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true }  // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});


// Root route (Optional for debugging)
app.get('/', (req, res) => {
  res.send('Welcome to the MERN Application API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));