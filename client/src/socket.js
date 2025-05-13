import { io } from 'socket.io-client';

// Connect to backend Socket.IO server (make sure it's running on port 8000)
const socket = io('http://localhost:8000');

export default socket;
