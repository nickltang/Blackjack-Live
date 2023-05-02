// Router
const { Router } = require('express');
const app = Router();


// Middleware
const { protect } = require('../middleware/authMiddleware')

// Routes
const {
    createGame,
    joinGame,
    leaveGame
} = require('../controllers/gameController');

app.post('/create-game', protect, createGame);

app.post('/join-game', protect, joinGame);

app.post('/leave-game', protect, leaveGame);


module.exports = app;