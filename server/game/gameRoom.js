const { Player } = require("./player")
const blackjack = require('engine-blackjack')
const {parse, stringify, toJSON, fromJSON} = require('flatted');

const actions = blackjack.actions
const Game = blackjack.Game

class GameRoom {    
    constructor(roomId, socket) {
        this.socket = socket
        this.roomId = roomId;
        this.maxPlayers = 2;
        this.players = [];
        this.game = new Game();
    }
  
    addPlayer(player,) {
        if (this.players.length < this.maxPlayers) {
            this.players.push(player);
            return true;
        }
        return false;
    }
  
    removePlayer(player) {
        this.players = this.players.filter(p => p !== player);
        player.emit('player left', player.name);
    }
    
    getState() {
        return {
            game: this.game.getState(),
            players: this.players.map(player => player.getState())
        }
    }
  
    listen(io, socket) {
        console.log('listen')

        socket.on('getGameState', () => {
            console.log(this.roomId)
            io.to(this.roomId).emit('gameState', this.getState())
        })

        socket.on("action", (action) => {
            // Check if game is over
            if (this.gameOver) {
                console.log("Game over. Cannot perform any more actions.");
                return;
            }

            const newState = this.game.dispatch(action);

            // Check if the game is over
            if (newState.stage === "done") {
                this.gameOver = true;
            }

            // Broadcast the new game state to all players in the room
            io.to(this.roomId).emit("gameState", newState);
        });


        // Handle player disconnection
        socket.on("disconnect", () => {
            console.log(`Player disconnected from room ${this.roomId}`);
        });
    }
  }


const initGameRooms = (io) => {
    // Stores all game rooms
    const rooms = {};

    // Listeners
    io.on('connection', (socket) => {
        socket.on('createRoom', (roomId) => {
            console.log(`Creating room ${roomId}`)

            const gameRoom = new GameRoom(roomId, socket);
            rooms[roomId] = gameRoom;
            gameRoom.listen(io, socket);

            socket.emit('createRoomResponse', gameRoom.roomId)
        });


        socket.on('joinRoom', (roomId, playerId) => {
            console.log(`Player ${playerId} attempting to join room ${roomId}`)

            const newPlayer = new Player(playerId, io)
            const currentRoom = rooms[roomId]
            
            if(currentRoom.addPlayer(newPlayer)) {
                socket.join(roomId)   
                io.to(roomId).emit('joinedRoom', roomId)
            } else {
                socket.emit('error', 'RoomFullError')
            }
        })

        socket.on('roomOpen', () => {
            if (!rooms[roomId]) {
                socket.emit('error', 'GameNotFoundError')    
            } else {
                socket.emit('roomOpenResponse', roomId)
            }
        })

        socket.on('leaveRoom', (roomId, playerId) => {
            // Locate game room object
            if (!rooms[roomId]) {
                socket.emit('Error', 'GameNotFoundError')
            } else {
                const newPlayer = new Player(playerId, io)
                rooms[roomId].removePlayer
            }
        })

    });
};

module.exports = {
    GameRoom,
    initGameRooms
}