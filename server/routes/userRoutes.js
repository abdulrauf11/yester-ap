import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET user info by ID (for navbar/profile)
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id, 'username coins');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user info' });
  }
});

// PATCH to update username/password (for profile update)
router.patch('/user/:id', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (password) user.password = password;

    await user.save();
    res
      .status(200)
      .json({ message: 'Profile updated', username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router;
