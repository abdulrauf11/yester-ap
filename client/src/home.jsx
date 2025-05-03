import { Link } from 'react-router-dom';
import '../../design/css/home.css';

function Home() {
  return (
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
  );
}

export default Home;
