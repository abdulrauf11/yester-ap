import { Link, useNavigate } from 'react-router-dom';
import '../../design/css/login.css';
import { useState } from 'react';
import axios from 'axios';
import { useGlobalState } from './GlobalStateContext';

function Login() {
  // Local state for form fields and response message
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();
  const { loggedInUser, setLoggedInUser } = useGlobalState(); // Access global user state and setter

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form refresh

    try {
      // Send login request to backend
      const res = await axios.post('http://localhost:8000/api/login', {
        username,
        password,
      });

      console.log(res.data.message);
      setMessage(res.data.message); // Show success or error message

      if (res.status === 200) {
        // Save user info to global state (if not already set)
        if (!loggedInUser) {
          setLoggedInUser({
            userId: res.data.userId,
            username: res.data.username,
          });
        }
        navigate('/home'); // Redirect to home on successful login
      }
    } catch (err) {
      // Show error message if login fails
      console.log(err);
      setMessage(err.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <main className="auth-container">
      <h1 className="auth-title">Login</h1>

      {/* Form submission handled by handleSubmit */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)} // Update local state on input change
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update local state on input change
        />

        <button type="submit" className="btn btn-primary">
          Log In
        </button>

        {/* Show server response message (success or error) */}
        <p>{message}</p>
      </form>

      {/* Navigation to signup if user doesn't have an account */}
      <p className="auth-footer">
        Don’t have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </main>
  );
}

export default Login;
