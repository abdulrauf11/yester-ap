import { Link, useNavigate } from 'react-router-dom';
import '../../design/css/waiting.css';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useGlobalState } from './GlobalStateContext';
import Navbar from './Navbar';

// Connect to backend Socket.IO server (make sure it's running on port 8000)
const socket = io('http://localhost:8000');

function Waiting() {
  const { loggedInUser } = useGlobalState(); // Access user
  const navigate = useNavigate(); // Used to redirect when a match is found

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login'); // Redirect if not logged in
      return;
    }

    // Ask server to find a match for this user
    socket.emit('find_match', {
      userId: loggedInUser.userId,
      username: loggedInUser.username,
    });

    // Listen for a match to be made and game to start
    socket.on('start_game', (data) => {
      console.log('START'); // Debug: confirm the event was received
      navigate(`/newgame/${data.gameId}`); // Redirect to the game screen
    });

    // Cleanup when component unmounts or user changes
    return () => {
      socket.off('start_game'); // remove the listener
    };
  }, [loggedInUser, navigate]); // runs again only when user logs in or changes

  return (
    <div>
      <Navbar />
      <main className="waiting-container">
        <h1 className="waiting-title">Waiting for Opponent…</h1>
        <p className="waiting-subtitle">Matchmaking in progress</p>
        <Link to="/home">
          <button id="cancelBtn" className="btn btn-secondary">
            Cancel
          </button>
        </Link>
      </main>
    </div>
  );
}

export default Waiting;
