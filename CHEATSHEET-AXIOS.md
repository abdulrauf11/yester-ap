Here's the complete guide in Markdown format:

---

# Fetching Data from MongoDB using Axios + Express

## 1. Backend Setup (Express + Mongoose)

Create a route in your backend to fetch data from the MongoDB database using Mongoose. For example, to get all users from a `User` model:

```js
// routes/userRoutes.js
import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // fetch all users from MongoDB
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

export default router;
```

Make sure this route is connected in your `app.js`:

```js
// app.js
import userRoutes from './routes/userRoutes.js';
app.use('/api', userRoutes);
```

## 2. Frontend (React + Axios)

In your React component, use the `useEffect` hook to fetch the data using Axios:

```js
import { useEffect, useState } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
```

---

Let me know if you want this turned into a `.md` file for download.
