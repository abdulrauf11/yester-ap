import { Server } from 'socket.io';
import http from 'http';
import { app } from './app.js';
import mongoose from 'mongoose';

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Create a Socket.IO server on top of the HTTP server
// CORS is enabled to allow frontend to connect from any origin
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: false,
  },
});

// A queue to keep track of players waiting to be matched
const waitingQueue = [];

// Handle new socket connections from the client
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  // When a player wants to find a match
  socket.on('find_match', ({ userId, username }) => {
    console.log(`🔍 ${username} is looking for a match`);

    // Prevent duplicate entries in queue (same user or socket)
    const alreadyInQueue = waitingQueue.some(
      (player) => player.userId === userId || player.socket.id === socket.id
    );
    if (alreadyInQueue) {
      console.log(`⚠️ ${username} is already in the queue`);
      return;
    }

    // Add player to the queue
    waitingQueue.push({ socket, userId, username });

    // If at least two different players are waiting, match them
    if (waitingQueue.length >= 2) {
      const player1 = waitingQueue.shift();
      const player2 = waitingQueue.shift();

      // Make sure they’re not the same user
      if (player1.userId === player2.userId) {
        console.log('❌ Same user detected in matchmaking. Aborting match.');
        // Put one player back in queue
        waitingQueue.push(player2);
        return;
      }

      // Create a unique game room ID
      const gameId = `game_${Math.floor(Math.random() * 10000)}`;

      // Join both players to the same game room
      player1.socket.join(gameId);
      player2.socket.join(gameId);

      // Emit game start event to both players
      io.to(gameId).emit('start_game', {
        gameId,
        players: {
          [player1.socket.id]: { username: player1.username },
          [player2.socket.id]: { username: player2.username },
        },
      });

      console.log(`🎮 Match made: ${player1.username} vs ${player2.username}`);
    }
  });
});

// Start the backend server on port 8000
server.listen(8000, () => {
  console.log('🚀 Server is running on port 8000');
});

// Connect to local MongoDB instance
const MONGO_URI = 'mongodb://localhost:27017/colorgrid';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
