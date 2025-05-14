import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  id: String,
  player1: {
    userId: String,
    username: String,
  },
  player2: {
    userId: String,
    username: String,
  },
  winner: String, // userId of winner
  createdAt: {
    type: Date,
    default: Date.now,
  },
  grid: Object,
});

export default mongoose.model('Game', gameSchema);
