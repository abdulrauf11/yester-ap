import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import '../../design/css/gameplay.css';
import { useGlobalState } from './GlobalStateContext';
import socket from './socket';

function Game() {
  const { gameId } = useParams();
  const { loggedInUser, gameState } = useGlobalState(); // Access user and game state
  const navigate = useNavigate();

  // Extract current player and opponent from gameState
  const myPlayer = gameState?.players?.[gameState.yourSocketId];
  const opponentPlayer = Object.entries(gameState?.players || {}).find(
    ([socketId]) => socketId !== gameState.yourSocketId
  )?.[1];

  // State for game mechanics
  const [grid, setGrid] = useState(Array(25).fill(null));
  const [status, setStatus] = useState('Waiting...');
  const [currentTurn, setCurrentTurn] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    if (!loggedInUser || !gameState) {
      navigate('/login');
      return;
    }

    const myId = gameState.yourSocketId;
    const myColor = gameState.players[myId]?.color;
    const turnId = gameState.firstTurn;

    setPlayerId(myId);
    setPlayerColor(myColor);
    setCurrentTurn(turnId);
    setStatus(turnId === myId ? 'Your Turn' : 'Opponent Turn');

    // 🔄 Handle real-time tile updates
    socket.on('move_made', ({ index, color, nextTurn }) => {
      setGrid((prev) => {
        const updated = [...prev];
        updated[index] = color;
        return updated;
      });
      setCurrentTurn(nextTurn);
      setStatus(nextTurn === myId ? 'Your Turn' : 'Opponent Turn');
    });

    // 🏁 Handle game end logic
    socket.on('game_end', ({ result, winner, loser }) => {
      setGameEnded(true);

      if (result === 'draw') {
        setStatus('Draw');
      } else if (winner === myId) {
        setStatus('You Won (+200 coins)');
      } else {
        setStatus('You Lost (-200 coins)');
      }
    });

    return () => {
      socket.off('move_made');
      socket.off('game_end');
    };
  }, [gameId, loggedInUser, gameState, navigate]);

  // 🎯 Handle tile click
  const handleTileClick = (index) => {
    if (grid[index] || currentTurn !== playerId || gameEnded) return;

    socket.emit('make_move', {
      gameId,
      index,
      color: playerColor,
    });
  };

  // ❌ Forfeit game
  const handleForfeit = () => {
    socket.emit('forfeit_game', { gameId });
  };

  return (
    <div>
      <Navbar key={gameEnded} />
      <main className="game-container">
        {/* 👥 Players Header */}
        <div className="players-header">
          <div className="player">
            <img
              src="https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa?rs=1&pid=ImgDetMain"
              alt="You"
              style={{ width: 100, height: 100 }}
            />
            <span>{myPlayer?.username || 'You'}</span>
          </div>
          <span className="vs">VS</span>
          <div className="player">
            <img
              src="https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa?rs=1&pid=ImgDetMain"
              alt="Opponent"
              style={{ width: 100, height: 100 }}
            />
            <span>{opponentPlayer?.username || 'Opponent'}</span>
          </div>
        </div>

        {/* 🟦 Game Grid */}
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

        {/* 📢 Status + Forfeit + End Controls */}
        <div className="status-area">
          <p id="status">
            Status: <span>{status}</span>
          </p>
          {!gameEnded && (
            <button
              className="btn btn-secondary"
              id="forfeitBtn"
              onClick={handleForfeit}
            >
              Forfeit
            </button>
          )}
          {gameEnded && (
            <Link className="btn btn-primary" to="/home">
              Go back
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}

export default Game;
