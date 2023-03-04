// import modules
const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()


// app
const app = express()


// database
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Database connected.'))
.catch((err) => console.log('Database connection error', err))


// middleware
app.use(morgan('dev'))
app.use(cors({origin: true, credentials: true}))
app.use(express.json({ extended: false }));


// routes
const testRoutes = require('./routes/test')
app.use('/', testRoutes)


// port
const port = process.env.PORT || 8080


// listener
const server = app.listen(() => console.log(`Server is running on ${port}`))



