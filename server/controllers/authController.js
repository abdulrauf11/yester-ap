import User from '../models/User.js';

// Controller to handle user signup
export const signupUser = async (req, res) => {
  const { username, password } = req.body;

  // Check if a user with the same username already exists
  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(400).json({ message: 'Username taken' });
  }

  // If not taken, create a new user using the User model
  const user = new User({ username, password });

  // Save the user to the MongoDB database
  await user.save();

  // Respond with success message and return the user ID and username
  res.status(200).json({
    message: 'User Added',
    userId: user._id,
    username: user.username,
  });
};

// Controller to handle user login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Look for a user with the given username
  const user = await User.findOne({ username });

  // If user exists and password matches, return success
  if (user && user.password === password) {
    return res.status(200).json({
      message: 'Login Successful',
      userId: user._id,
      username: user.username,
    });
  } else {
    // If credentials don't match, return error
    return res.status(400).json({ message: 'credentials donot match' });
  }
};
