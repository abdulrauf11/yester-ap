import Game from '../models/Game.js';

export const saveGame = async (game, p1, p2, winnerId) => {
  const g = new Game({
    id: game.id.split('_')[1],
    player1: {
      userId: p1.userId,
      username: p1.username,
    },
    player2: {
      userId: p2.userId,
      username: p2.username,
    },
    winner: winnerId, // winner id
    grid: game.grid,
  });

  await g.save().catch((err) => console.error('❌ Game save failed:', err));
};
