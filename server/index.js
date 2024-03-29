// import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware')
require('dotenv').config();


// app
const app = express()

// database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected.'))
    .catch((err) => console.log('Database connection error', err));


// middleware
app.use(morgan('dev'));
app.use(cors({origin: '*', credentials: true}));
app.use(express.json({ extended: false }));
app.use(errorHandler);


// user endpoints
const gameRoutes = require('./routes/game');
const userRoutes = require('./routes/users');

app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes)


const { GameRoom, initGameRooms } = require("./game/gameRoom")
const { Player } = require("./game/player")
const rooms = {}

// instantiate socket server and game room listener
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
})
initGameRooms(io, rooms)


// port
const port = process.env.PORT || 8000

// listener
server.listen(port, () => console.log(`Server is running on ${port}`))



