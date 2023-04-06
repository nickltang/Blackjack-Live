// import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();


// app
const app = express();
const router = express.Router();


// database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database connected.'))
    .catch((err) => console.log('Database connection error', err));


// middleware
app.use(morgan('dev'));
app.use(cors({origin: '*', credentials: true}));
app.use(express.json({ extended: false }));


// routes
const gameRoutes = require('./routes/game');
const userRoutes = require('./routes/users');

app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes)


// port
const port = process.env.PORT || 8000

// listener
app.listen(port, () => console.log(`Server is running on ${port}`))



