
const http = require('http').Server(app);
//const io = require('socket.io')(http);
const io = socketIO(server);

const poolConnection = require("../database Connection/dbConn");
const pool = poolConnection;


app.get('/messages', async (req, res) => {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM messages ORDER BY created_at DESC LIMIT 50');
      res.json(result.rows);
    } finally {
      client.release();
    }
  });
  
  app.post('/messages', async (req, res) => {
    const { username, message } = req.body;
    const client = await pool.connect();
    try {
      await client.query('INSERT INTO messages (username, message) VALUES ($1, $2)', [username, message]);
      io.emit('message', { username, message });
      res.sendStatus(200);
    } finally {
      client.release();
    }
  });


  io.on('connection', (socket) => {
    console.log('a user connected');
  
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  
    socket.on('chat message', async (msg) => {
      try {
        await pool.query('INSERT INTO messages (name, message) VALUES ($1, $2)', [msg.name, msg.message]);
        io.emit('chat message', msg);
      } catch (error) {
        console.error(error);
      }
    });
  });