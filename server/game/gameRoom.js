const { Player } = require("./player")
const blackjack = require('engine-blackjack')
const {parse, stringify, toJSON, fromJSON} = require('flatted');

const actions = blackjack.actions
const Game = blackjack.Game

class GameRoom {    
    constructor(roomId) {
        this.roomId = roomId;
        this.maxPlayers = 1;
        this.player = null;
        this.maxCallers = 4
        this.callers = []
        this.game = new Game();
        this.currentBet = 10;
    }
    
    getState() {
        const state = {
            game: this.game.getState(),
            player: this.player.getState(),
            callers: this.callers
        }

        return state
    }
    

    listen(io, socket) {
        socket.on('getGameState', (playerId) => {
            io.to(this.roomId).emit('gameState', this.getState(playerId))
        })

        socket.on("deal", () => {
            this.game.dispatch(actions.deal());
            io.to(this.roomId).emit("gameState", this.getState());
        });

        socket.on("bet", async (betAmount, playerId) => {
            console.log('bet', betAmount * 10)
            this.currentBet = betAmount * 10
            this.player.incBalanceReturnUser(playerId, this.currentBet * -1)

            io.to(this.roomId).emit("gameState", this.getState(), 'showdown');
        })

        socket.on("hit", (playerId) => {
            console.log('hit')
            this.game.dispatch(actions.hit('right'))

            if(this.game.getState().stage === 'done') {
                // Save updated balance
                const moneyWon = this.game.getState().wonOnRight
                if(moneyWon > 0) {
                    console.log('money won', moneyWon)
                    const addToBalance = (moneyWon/10) * this.currentBet
                    this.player.incBalanceReturnUser(playerId, addToBalance)
                } else {
                    console.log('no money won')
                }
            }

            io.to(this.roomId).emit("gameState", this.getState());
        });

        socket.on("stand", (playerId) => {
            console.log('stand')

            this.game.dispatch(actions.stand('right'))

            if(this.game.getState().stage === 'done') {
                // Save updated balance
                const moneyWon = this.game.getState().wonOnRight
                if(moneyWon > 0) {
                    console.log('money won', moneyWon)
                    const addToBalance = (moneyWon/10) * this.currentBet
                    this.player.incBalanceReturnUser(playerId, addToBalance)
                } else {
                    console.log('no money won')
                }
            }

            io.to(this.roomId).emit("gameState", this.getState());
        });

        socket.on("nextRound", (playerId) => {
            console.log('next round')

            this.game = new Game();
            io.to(this.roomId).emit("gameState", this.getState());
        });

        socket.on("disconnect", () => {
            console.log(`Player disconnected from room ${this.roomId}`);
        });
    }
  }


// Declares listeners that listen for game room creation/join/leave
const initGameRooms = (io, rooms) => {
    io.on('connection', (socket) => {
        socket.on('createRoom', (roomId) => {
            console.log(`Creating room ${roomId}`)

            const gameRoom = new GameRoom(roomId);
            rooms[roomId] = gameRoom;
            gameRoom.listen(io, socket);

            socket.emit('createRoomResponse', gameRoom.roomId)
        });

        socket.on('spectateRoom', roomId => {
            socket.join(roomId)   
            io.to(roomId).emit('spectator', roomId)
        })


        socket.on('joinRoom', async (roomId, playerId) => {
            if (!playerId)
                return
            const currentRoom = rooms[roomId]

            // Player
            if(currentRoom.player == null) {
                console.log(`Player ${playerId} joining room ${roomId}`)

                const newPlayer = await Player.create(playerId)
                currentRoom.player = newPlayer
                currentRoom.callers.push(playerId)

                socket.join(roomId)   
                io.to(roomId).emit('joinedRoom', roomId, newPlayer.getState(playerId))
            }
            else if(currentRoom.player !== null && currentRoom.callers.length <= currentRoom.maxCallers) {
                console.log(`Caller ${playerId} joining room ${roomId}`)

            }
            else {
                console.log(`Room ${roomId} full.`)
                socket.emit('error', 'RoomFullError')
            }
        })

        socket.on('roomOpen', (roomId) => {
            if (!rooms[roomId]) {
                socket.emit('error', 'GameNotFoundError')    
            } else {
                socket.emit('roomOpenResponse', roomId)
            }
        })

        socket.on('leaveRoom', (roomId, playerId) => {
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