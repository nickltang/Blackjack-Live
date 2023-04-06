// Router
const { Router } = require('express');
const app = Router();


// Middleware


// Routes
const {
    createGame,
    joinGame,
    leaveGame
} = require('../controllers/gameController');

app.post('/create-game', createGame);

app.post('/join-game', joinGame);

app.post('/leave-game', leaveGame);


module.exports = app;