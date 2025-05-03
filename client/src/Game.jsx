import '../../design/css/gameplay.css';

function Game() {
  return (
    <main className="game-container">
      <div className="players-header">
        <div className="player">
          {/* <img
            src="https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa?rs=1&pid=ImgDetMain"
            alt="You"
            style="width: 100px; height: 100px;"
          /> */}
          <span>You</span>
        </div>
        <span className="vs">VS</span>
        <div className="player">
          {/* <img
            src="https://th.bing.com/th/id/OIP.eMLmzmhAqRMxUZad3zXE5QHaHa?rs=1&pid=ImgDetMain"
            alt="Opponent"
            style="width: 100px; height: 100px;"
          /> */}
          <span>Opponent</span>
        </div>
      </div>

      <div className="grid"></div>

      <div className="status-area">
        <p id="status">
          Status: <span>Your Turn</span>
        </p>
        <button id="forfeitBtn" className="btn btn-secondary">
          Forfeit
        </button>
        <button id="playAgainBtn" className="btn btn-primary hidden">
          Play Again
        </button>
      </div>
    </main>
  );
}

export default Game;
