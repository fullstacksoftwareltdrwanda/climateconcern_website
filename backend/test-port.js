const net = require('net');

[5432, 5433, 5434].forEach(port => {
  const socket = new net.Socket();
  socket.setTimeout(2000);
  socket.on('connect', () => {
    console.log(`Port ${port} is OPEN!`);
    socket.destroy();
  });
  socket.on('timeout', () => {
    console.log(`Port ${port} timed out`);
    socket.destroy();
  });
  socket.on('error', (err) => {
    console.log(`Port ${port} error:`, err.message);
  });
  socket.connect(port, '127.0.0.1');
});
