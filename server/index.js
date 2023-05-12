// import modules
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware')
require('dotenv').config();
const {v4: uuidv4} = require('uuid')


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



// routes
const gameRoutes = require('./routes/game');
const userRoutes = require('./routes/users');

app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes)


// instantiate socket server
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"],
    }
})

const { GameRoom, initGameRooms } = require("gameRoom")
const { Player } = require("Player")

// Listen for socket events with name "connection"
io.on("connection", (socket) =>{
    console.log(`User Connected: ${socket.id}`);
  
    socket.on("createTable", () => {
        const newTableId = uuidv4()
        socket.join(newTableId);

        console.log(`User ID: ${socket.id} joined the table: ${newTableId}`)
        socket.to(newTableId).emit("createTableResponse", newTableId)
    });

    // table id is in in data, data passed from client
    socket.on("joinTable", (data) => {
        socket.join(data);
        console.log(`User ID: ${socket.id} joined the table: ${data}`)
    });
  
    // listens for message data to be emitted from client side / creates event send_message
    socket.on("sendMessage", (data) => {
        // Emits messages you send to all other uses in the chatRoom
        socket.to(data.tableId).emit("receiveMessage", data);
        console.log(data);
    });
  
    // disconnect from the server at the end
    socket.on("disconnect", () => {
      console.log("User Disconnected", socket.id);
    });
  });
  




// port
const port = process.env.PORT || 8000

// listener
server.listen(port, () => console.log(`Server is running on ${port}`))



