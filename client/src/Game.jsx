import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../../design/css/gameplay.css';

function Game() {
  const { gameId } = useParams(); // get game ID from URL
  const [grid, setGrid] = useState(Array(25).fill(null)); // 5x5 = 25 tiles
  const [status, setStatus] = useState('Your Turn'); // default status
  const [showPlayAgain, setShowPlayAgain] = useState(false);

  const handleTileClick = (index) => {
    // TODO: Only allow click if it's user's turn and cell is empty
    if (!grid[index]) {
      const newGrid = [...grid];
      newGrid[index] = Math.random() < 0.5 ? 'red' : 'blue'; // placeholder
      setGrid(newGrid);

      // TODO: emit socket move, switch turn, etc.
    }
  };

  return (
    <div>
      <Navbar />

      <main className="game-container">
        <div className="players-header">
          <div className="player">
            <img
              src="https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa?rs=1&pid=ImgDetMain"
              alt="You"
              style={{ width: 100, height: 100 }}
            />
            <span>You</span>
          </div>
          <span className="vs">VS</span>
          <div className="player">
            <img
              src="https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa?rs=1&pid=ImgDetMain"
              alt="Opponent"
              style={{ width: 100, height: 100 }}
            />
            <span>Opponent</span>
          </div>
        </div>

        <div className="grid">
          {grid.map((color, i) => (
            <div
              key={i}
              className="cell"
              style={{ backgroundColor: color || '#ddd' }}
              onClick={() => handleTileClick(i)}
            />
          ))}
        </div>

        <div className="status-area">
          <p id="status">
            Status: <span>{status}</span>
          </p>
          <button className="btn btn-secondary" id="forfeitBtn">
            Forfeit
          </button>
          {showPlayAgain && (
            <button className="btn btn-primary" id="playAgainBtn">
              Play Again
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default Game;
