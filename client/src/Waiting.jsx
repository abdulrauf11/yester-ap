import { Link, useNavigate } from 'react-router-dom';
import '../../design/css/waiting.css';
import { useEffect } from 'react';
import { useGlobalState } from './GlobalStateContext';
import Navbar from './Navbar';
import socket from './socket';

function Waiting() {
  const { loggedInUser, setGameState } = useGlobalState(); // Access user
  const navigate = useNavigate(); // Used to redirect when a match is found

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login'); // Redirect to login page if user is not logged in
      return;
    }

    // ✅ Reconnect socket if it was disconnected
    if (!socket.connected) {
      socket.connect();
    }

    // Ask server to find a match for this user
    console.log(
      '📤 Emitting find_match for:',
      loggedInUser.username,
      loggedInUser.userId
    );
    socket.emit('find_match', {
      userId: loggedInUser.userId,
      username: loggedInUser.username,
    });

    // Listen for a match to be made and game to start
    socket.on('start_game', (data) => {
      console.log('🎯 Received start_game in Waiting:', data); // Confirm event received
      setGameState(data); // ✅ save game info globally
      // Redirect to the game screen once matched
      navigate(`/newgame/${data.gameId}`);
    });

    // Cleanup when component unmounts or user changes
    return () => {
      socket.off('start_game'); // Remove the listener to prevent multiple bindings
    };
  }, [loggedInUser, navigate, setGameState]); // runs again only when user logs in or changes

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
