// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // You can restrict this to your frontend domain
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Basic route to confirm it's running
app.get('/', (req, res) => {
  res.send('Live Chat Backend Running');
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('message:send', (data) => {
    console.log('Message received:', data);
    io.emit('message:receive', data); // Broadcast to all clients
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
