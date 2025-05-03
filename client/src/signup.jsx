import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import '../../design/css/signup.css';
import { useGlobalState } from './GlobalStateContext';

function Signup() {
  // Local state for form input and response messages
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate(); // Used to navigate programmatically after signup
  const { loggedInUser, setLoggedInUser } = useGlobalState(); // Access global state to store user info

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default page refresh on form submit

    try {
      // Send signup request to backend using axios
      const res = await axios.post('http://localhost:8000/api/signup', {
        username,
        password,
      });

      console.log(res.data.message);
      setMessage(res.data.message); // Show success message

      if (res.status === 200) {
        // Set user in global state if not already set
        if (!loggedInUser) {
          setLoggedInUser({
            userId: res.data.userId,
            username: res.data.username,
          });
        }
        navigate('/home'); // Redirect to home page on successful signup
      }
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || 'SignUp Failed'); // Show error message
    }
  };

  return (
    <main className="auth-container">
      <h1 className="auth-title">Sign Up</h1>

      {/* React handles form submission through handleSubmit (no need for action/method attributes) */}
      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Username input */}
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password input */}
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit button triggers handleSubmit */}
        <button type="submit" className="btn btn-primary">
          Create Account
        </button>

        {/* Message from backend (success or failure) */}
        <p>{message}</p>
      </form>

      {/* Link to login if user already has an account */}
      <p className="auth-footer">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </main>
  );
}

export default Signup;
