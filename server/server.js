import { Server } from 'socket.io';
import http from 'http';
import { app } from './app.js';
import mongoose from 'mongoose';
import { maxAreaOfIsland } from './utils/maxAreaOfIsland.js';
import { updateCoins } from './utils/updateCoins.js';
import { saveGame } from './utils/saveGame.js';

// Create HTTP server from Express app
const server = http.createServer(app);

// Create a Socket.IO server and allow CORS for frontend to connect
const io = new Server(server, {
  cors: {
    origin: '*', // allow requests from any frontend origin
    methods: ['GET', 'POST'],
    credentials: false,
  },
});

// Store players waiting for a match
const waitingQueue = [];

// Store ongoing game sessions
const activeGames = {}; // { gameId: { grid, players, turn, movesMade } }

// When a new client connects via socket
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // When client sends 'find_match' event
  socket.on('find_match', ({ userId, username }) => {
    console.log(`🔍 ${username} is looking for a match`);

    // Prevent duplicate entries in the queue
    const alreadyInQueue = waitingQueue.some(
      (player) => player.userId === userId
    );
    if (alreadyInQueue) {
      console.log(`⚠️  ${username} is already in the queue`);
      return;
    }
    const isAlreadyInGame = Object.values(activeGames).some((game) =>
      Object.values(game.players).some((player) => player.userId === userId)
    );
    if (isAlreadyInGame) {
      console.log(`🚫 ${username} is already in an active game`);
      return;
    }

    // Add player to the queue
    waitingQueue.push({ socket, userId, username });

    // Matchmaking logic: if 2 players are available, create a match
    if (waitingQueue.length >= 2) {
      const player1 = waitingQueue.shift();
      const player2 = waitingQueue.shift();

      const gameId = `game_${Math.floor(Math.random() * 10000)}`;

      // Create a new game entry
      activeGames[gameId] = {
        id: gameId,
        grid: Array(25).fill(null), // 5x5 grid
        turn: player1.socket.id, // who starts first
        movesMade: 0,
        players: {
          [player1.socket.id]: {
            userId: player1.userId,
            username: player1.username,
            color: 'rgb(255, 69, 58)', // red
          },
          [player2.socket.id]: {
            userId: player2.userId,
            username: player2.username,
            color: 'rgb(0, 122, 255)', // blue
          },
        },
      };

      // Join both players to the same room
      player1.socket.join(gameId);
      player2.socket.join(gameId);

      // Emit 'start_game' to each player individually with their socket ID
      [player1.socket, player2.socket].forEach((playerSocket) => {
        playerSocket.emit('start_game', {
          gameId,
          players: activeGames[gameId].players,
          firstTurn: activeGames[gameId].turn,
          yourSocketId: playerSocket.id,
        });
      });

      console.log(
        `🎮 Match made: ${player1.username} vs ${player2.username} in ${gameId}`
      );
    }
  });

  // When client sends 'make_move' event
  socket.on('make_move', async ({ gameId, index, color }) => {
    const game = activeGames[gameId];
    if (!game || game.grid[index]) return;

    // Save move to grid and increment move count
    game.grid[index] = color;
    game.movesMade++;

    // Switch turn to the other player
    const allPlayers = Object.keys(game.players);
    const nextTurn = allPlayers.find((id) => id !== socket.id);
    game.turn = nextTurn;

    // Emit move update to both players
    io.to(gameId).emit('move_made', {
      index,
      color,
      nextTurn,
    });

    // Check if game is over (25 moves made)
    if (game.movesMade === 25) {
      const flatGrid = game.grid;
      const fullGrid = [];
      for (let i = 0; i < 5; i++) {
        fullGrid.push(flatGrid.slice(i * 5, (i + 1) * 5));
      }

      const [p1, p2] = Object.keys(game.players);
      const c1 = game.players[p1].color;
      const c2 = game.players[p2].color;

      const grid1 = fullGrid.map((row) =>
        row.map((cell) => (cell === c1 ? 1 : 0))
      );
      const grid2 = fullGrid.map((row) =>
        row.map((cell) => (cell === c2 ? 1 : 0))
      );

      const area1 = maxAreaOfIsland(grid1);
      const area2 = maxAreaOfIsland(grid2);

      let result = 'draw';
      let winner = null;
      let loser = null;

      if (area1 > area2) {
        result = 'win';
        winner = p1;
        loser = p2;
      } else if (area2 > area1) {
        result = 'win';
        winner = p2;
        loser = p1;
      }

      io.to(gameId).emit('game_end', {
        result,
        winner,
        loser,
      });
      // Handle coin update if someone won
      if (result === 'win') {
        updateCoins(game.players[winner].userId, +200);
        updateCoins(game.players[loser].userId, -200);
      }

      // Save game to DB
      saveGame(
        game,
        game.players[winner],
        game.players[loser],
        result === 'win' ? game.players[winner].userId : null
      );

      delete activeGames[gameId];
    }
  });

  // When client sends 'forfeit_game' event
  socket.on('forfeit_game', async ({ gameId }) => {
    const game = activeGames[gameId];
    if (!game) return;

    const opponentId = Object.keys(game.players).find((id) => id !== socket.id);

    // Send result to both players
    io.to(gameId).emit('game_end', {
      result: 'forfeit',
      winner: opponentId,
      loser: socket.id,
    });
    updateCoins(game.players[opponentId].userId, +200);
    updateCoins(game.players[socket.id].userId, -200);

    // Save to DB
    saveGame(
      game,
      game.players[opponentId],
      game.players[socket.id],
      game.players[opponentId].userId
    );

    // Clean up
    delete activeGames[gameId];
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    console.log('❌ User disconnected:', socket.id);

    // Remove from activeGames if user was in a game
    for (const gameId in activeGames) {
      const game = activeGames[gameId];
      if (game.players[socket.id]) {
        const opponentId = Object.keys(game.players).find(
          (id) => id !== socket.id
        );

        io.to(gameId).emit('game_end', {
          result: 'forfeit',
          winner: opponentId,
          loser: socket.id,
        });
        updateCoins(game.players[opponentId].userId, +200);
        updateCoins(game.players[socket.id].userId, -200);

        // Save to DB
        saveGame(
          game,
          game.players[opponentId],
          game.players[socket.id],
          game.players[opponentId].userId
        );

        delete activeGames[gameId];
        break;
      }
    }

    // Also remove from waitingQueue if unmatched
    const index = waitingQueue.findIndex((p) => p.socket.id === socket.id);
    if (index !== -1) waitingQueue.splice(index, 1);
  });
});

// Start backend server
server.listen(8000, () => {
  console.log('🚀 Server is running on port 8000');
});

// Connect to MongoDB
const MONGO_URI = 'mongodb://localhost:27017/colorgrid';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
