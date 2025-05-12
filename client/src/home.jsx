import { Link, useNavigate } from 'react-router-dom';
import '../../design/css/home.css';
import { useEffect } from 'react';
import { useGlobalState } from './GlobalStateContext';
import Navbar from './Navbar';

function Home() {
  const { loggedInUser } = useGlobalState(); // Get user from global state
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login'); // Redirect if not logged in
    }
  }, [loggedInUser, navigate]);

  return (
    <div>
      <Navbar />
      <main className="home-container">
        <h1 className="home-title">Main Dashboard</h1>
        <div className="home-buttons">
          <Link to="/newgame/waiting" className="btn btn-primary">
            Play
          </Link>
          <Link to="/leaderboard" className="btn btn-secondary">
            Leaderboard
          </Link>
          <Link to="/history" className="btn btn-secondary">
            History
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Home;
