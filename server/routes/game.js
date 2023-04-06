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

app.post('/create-user', createUser);

app.get('/get-user-info', getUserInfo);

app.post('/update-user-info', updateUserInfo);

app.post('/login', logIn)

app.post('/logout', logOut)


module.exports = app;