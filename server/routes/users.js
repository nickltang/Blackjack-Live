// Router
const { Router } = require('express');
const app = Router();


// Middleware


// Routes
const {
    createUser,
    getUserInfo,
    updateUserInfo,
    logIn,
    logOut
} = require('../controllers/usersController');

const { protect } = require('../middleware/authMiddleware')

app.post('/create-user', createUser);

app.get('/get-user-info', protect, getUserInfo);

app.post('/update-user-info', protect, updateUserInfo);

app.post('/login', logIn)


module.exports = app;