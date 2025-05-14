import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalState } from './GlobalStateContext';
import axios from 'axios';
import socket from './socket';

function Navbar() {
  const { loggedInUser, setLoggedInUser } = useGlobalState();
  const [coins, setCoins] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInUser) {
      axios
        .get(`http://localhost:8000/api/user/${loggedInUser.userId}`)
        .then((res) => {
          setCoins(res.data.coins);
        })
        .catch((err) => console.error(err));
    }
  }, [loggedInUser]);

  if (!loggedInUser) return null;

  const handleLogout = () => {
    socket.disconnect(); // triggers disconnect → server treats as forfeit
    setLoggedInUser(null);
    navigate('/');
  };

  return (
    <header className="navbar">
      <Link to="/home" className="nav-logo">
        🎨 ColorGrid
      </Link>

      <div className="nav-right">
        <span className="coins">
          💰 <span id="coinBalance">{coins ?? '...'}</span>
        </span>

        <div className="profile-dropdown">
          <img
            src="https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa?rs=1&pid=ImgDetMain"
            alt="Profile"
            className="profile-pic"
          />
          <span className="username">{loggedInUser.username}</span>

          <div className="dropdown-menu">
            <Link to="/update-profile">Update Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
