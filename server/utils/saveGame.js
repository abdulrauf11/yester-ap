import Game from '../models/Game.js';

// Save a completed game to the database
export const saveGame = async (game, p1, p2, winnerId) => {
  try {
    const g = new Game({
      id: game.id.split('_')[1], // Extract numeric ID from "game_1234"
      player1: {
        userId: p1.userId,
        username: p1.username,
      },
      player2: {
        userId: p2.userId,
        username: p2.username,
      },
      winner: winnerId, // userId of winner or null for draw
      grid: game.grid, // final game grid (flat array or object)
    });

    await g.save();
    console.log(`📁 Game ${g.id} saved to history`);
  } catch (err) {
    console.error('❌ Game save failed:', err);
  }
};
