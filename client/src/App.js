import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Ensure you import your CSS file

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to fetch users. Please check the server.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Update existing user
        await axios.put(`http://localhost:5000/api/users/${editingUserId}`, { username, email });
        setIsEditing(false);  // Reset editing state
        setEditingUserId(null);  // Clear editing user ID
      } else {
        // Register a new user
        await axios.post('http://localhost:5000/api/register', { username, email });
      }

      fetchUsers();  // Refresh the list of users after registration or update
      setUsername('');  // Clear input fields
      setEmail('');
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to save user. Please check the server.');
    }
  };

  // New deleteUser function
  const deleteUser = async (userId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to delete user. Please check the server.');
    }
  };

  // New editUser function
  const editUser = (user) => {
    setUsername(user.username);
    setEmail(user.email);
    setIsEditing(true);
    setEditingUserId(user._id);  // Store the ID of the user being edited
  };

  return (
    <div className="container">
      <h1>User Registration</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">{isEditing ? 'Update' : 'Register'}</button>
      </form>

      <h2>Registered Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.username} ({user.email})
            {/* Add edit and delete buttons for each user */}
            <button onClick={() => editUser(user)} style={{ marginLeft: '10px', color: 'blue' }}>
              Edit
            </button>
            <button onClick={() => deleteUser(user._id)} style={{ marginLeft: '10px', color: 'red' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;