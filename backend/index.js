const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const port = 3000;

app.use(express.static('frontend'));

io.on('connection', (socket) => {
  console.log(socket.id, 'connected');

  socket.on('state', (state) => {
    socket.broadcast.emit('state', { id: socket.id, state });
  });

  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected');
    socket.broadcast.emit('delete', { id: socket.id });
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
