import '../../design/css/update-profile.css';
import Navbar from './Navbar';
import { useState } from 'react';
import axios from 'axios';
import { useGlobalState } from './GlobalStateContext';
import { useNavigate } from 'react-router-dom';

function UpdateProfile() {
  const { loggedInUser, setLoggedInUser } = useGlobalState();
  const navigate = useNavigate();

  const [username, setUsername] = useState(loggedInUser?.username || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.patch(
        `http://localhost:8000/api/user/${loggedInUser.userId}`,
        {
          username,
          password,
        }
      );
      console.log(res);

      setMessage('✅ Profile updated!');
      // Update global state with new username
      setLoggedInUser((prev) => ({ ...prev, username }));
      navigate('/home');
    } catch (err) {
      console.error(err);
      setMessage('❌ Update failed');
    }
  };

  return (
    <div>
      <Navbar />
      <main className="update-container">
        <h1 className="update-title">Update Profile</h1>

        <form className="update-form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* <label htmlFor="profilePic">Profile Picture URL</label>
          <input
            id="profilePic"
            name="profilePic"
            type="url"
            value={profilePic}
          /> */}

          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>

          {message && <p>{message}</p>}
        </form>
      </main>
    </div>
  );
}

export default UpdateProfile;
