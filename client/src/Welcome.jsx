import { Link } from 'react-router-dom';
import '../../design/css/welcome.css'; // import the css file for the specific component

function Welcome() {
  return (
    <div>
      <main className="welcome-container">
        <h1 className="welcome-title">Welcome to ColorGrid</h1>
        <p className="welcome-subtitle">
          A real‑time, multiplayer grid conquest game.
        </p>
        <div className="welcome-buttons">
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
          <Link to="/signup" className="btn btn-secondary">
            SignUp
          </Link>
        </div>
      </main>
    </div>
  );
}

export default Welcome;
