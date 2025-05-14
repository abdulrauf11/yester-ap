import User from '../models/User.js';

export const updateCoins = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    user.coins = Math.max(0, user.coins + amount); // prevent negative coins
    await user.save();
    console.log(`💰 Updated coins for ${user.username}: ${user.coins}`);
  } catch (err) {
    console.error('❌ Error updating coins:', err);
  }
};
