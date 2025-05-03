import mongoose from 'mongoose';

// Define the structure (schema) of a User document in MongoDB
const userSchema = new mongoose.Schema({
  username: String, // Username of the player
  password: String, // Password
  coins: {
    type: Number,
    default: 1000, // Each new user starts with 1000 coins
  },
});

// Export the model so it can be used in other files (like controllers)
export default mongoose.model('User', userSchema);
