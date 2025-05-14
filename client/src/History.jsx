import { useEffect, useState } from 'react';
import { useGlobalState } from './GlobalStateContext';
import '../../design/css/history.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function History() {
  const { loggedInUser } = useGlobalState();
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login'); // Redirect to login page if user is not logged in
      return;
    }

    axios
      .get(`http://localhost:8000/api/history/user/${loggedInUser.userId}`)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  }, [loggedInUser, navigate]);

  return (
    <div>
      <Navbar />
      <main className="history-container">
        <h1 className="history-title">Your Game History</h1>
        <ul className="history-list">
          {history.map((game, index) => {
            const isPlayer1Me = game.player1.userId === loggedInUser.userId;
            const opponent = isPlayer1Me ? game.player2 : game.player1;

            let outcome;
            if (game.winner === null) {
              outcome = 'Draw';
            } else if (opponent.userId === game.winner) {
              outcome = 'Won';
            } else {
              outcome = 'Lost';
            }

            return (
              <li key={index}>
                <span>
                  <Link
                    to={'/history/' + game.id}
                  >{`Game ${game.id}  ${opponent.username}  ${outcome}`}</Link>
                </span>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}

export default History;
