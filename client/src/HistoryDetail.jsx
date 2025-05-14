import { Link, useNavigate, useParams } from 'react-router-dom';
import '../../design/css/history-detail.css'; // import the css file for the specific component
import Navbar from './Navbar';
import { useGlobalState } from './GlobalStateContext';
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';

function HistoryDetail() {
  const { gameId } = useParams();
  const { loggedInUser } = useGlobalState();
  const navigate = useNavigate();

  const [historyDetail, setHistoryDetail] = useState(null);

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login'); // Redirect to login page if user is not logged in
      return;
    }
    axios
      .get(`http://localhost:8000/api/history/game/${gameId}`)
      .then((res) => setHistoryDetail(res.data))
      .catch((err) => console.error(err));
  }, [loggedInUser, navigate, gameId]);

  let result;
  if (historyDetail?.winner === null) result = 'Draw';
  else if (loggedInUser?.userId === historyDetail?.winner) result = 'Won';
  else result = 'Lost';

  return (
    <div>
      <Navbar />
      <main className="snapshot-container">
        <h1 className="snapshot-title">
          Game {gameId} Result:{' '}
          <span className={'result ' + result?.toLowerCase()}>
            You {result}!
          </span>
        </h1>
        <div className="grid">
          {historyDetail?.grid.map((color, i) => (
            <div
              key={i}
              className={'cell ' + color || ''}
              style={{ backgroundColor: color || '#ddd' }}
            />
          ))}
        </div>
        <Link to="/history" className="btn btn-secondary">
          Back to History
        </Link>
      </main>
    </div>
  );
}

export default HistoryDetail;
