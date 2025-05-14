import Game from '../models/Game.js';

// Controller to fetch game history for a specific user
export const getGameHistory = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find all games where the user was either player1 or player2
    const history = await Game.find({
      $or: [{ 'player1.userId': userId }, { 'player2.userId': userId }],
    }).sort({ createdAt: -1 }); // Sort by most recent first

    // Send back the history list
    res.status(200).json(history);
  } catch (err) {
    console.error('❌ Error fetching history:', err);
    res.status(500).json({ message: 'Error fetching history' });
  }
};

// Controller to fetch details of a single game by custom gameId
export const getGameHistoryDetail = async (req, res) => {
  const { gameId } = req.params;

  try {
    // Find the game where the stored `id` field matches the gameId from URL
    const game = await Game.findOne({ id: gameId });

    // If not found, send 404 response
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    // Send back the game object
    res.status(200).json(game);
  } catch (err) {
    console.error('❌ Error fetching game detail:', err);
    res.status(500).json({ message: 'Error fetching game detail' });
  }
};
