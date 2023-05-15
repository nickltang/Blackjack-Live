const { Player } = require("./player")
const blackjack = require('engine-blackjack')
const {parse, stringify, toJSON, fromJSON} = require('flatted');

const actions = blackjack.actions
const Game = blackjack.Game

class GameRoom {    
    constructor(roomId) {
        this.roomId = roomId;
        this.maxPlayers = 1;
        this.players = [];
        this.game = new Game();
        this.currentBet = 10;
        this.video = []
    }
  
    addPlayer(player) {
        if (this.players.length < this.maxPlayers) {
            this.players.push(player);
            return true;
        }
        return false;
    }

    hasPlayer(playerId) {
        if (this.players.filter(p => p.id === playerId).length > 0)
            return true
        return false
    }
    
    getState() {
        const players = this.players.map(player => {
            return player.getState()
        })

        const state = {
            game: this.game.getState(),
            players: players,
        }

        return state
    }
    

    listen(io, socket) {
        socket.on('getGameState', (playerId) => {
            io.to(this.roomId).emit('gameState', this.getState(playerId))
        })

        socket.on("deal", (players) => {
            this.game.dispatch(actions.deal());
            io.to(this.roomId).emit("gameState", this.getState());

            // Need to deal again to get second set of cards
            // this.game.dispatch(actions.deal());
            // io.to(this.roomId).emit("gameState", this.getState());
        });

        socket.on("bet", (betAmount, playerId) => {
            console.log('bet', betAmount * 10)
            this.currentBet = betAmount * 10
            
            this.players[0].decBalanceReturnUser(playerId, betAmount * 10)

            io.to(this.roomId).emit("gameState", this.getState(), 'showdown');
        })

        socket.on("hit", () => {
            console.log('hit')
            this.game.dispatch(actions.hit('right'))

            io.to(this.roomId).emit("gameState", this.getState());
        });

        socket.on("stand", () => {
            console.log('stand')

            this.game.dispatch(actions.stand('right'))
            io.to(this.roomId).emit("gameState", this.getState());
        });

        socket.on("nextRound", (playerId) => {
            console.log('next round')
             // console.log(this.game.getState())


            // Save updated balance
            const moneyWon = this.game.getState().wonOnRight
            if(moneyWon > 0) {
                console.log('money won', moneyWon)
                const addToBalance = (moneyWon/10) * this.currentBet
                this.players[0].incBalanceReturnUser(playerId, addToBalance)
            } else {
                console.log('no money won')
            }

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
            console.log('current players length', currentRoom.players.length)

            if(!currentRoom.hasPlayer(playerId) && currentRoom.players.length < currentRoom.maxPlayers) {
                console.log(`Player ${playerId} joining room ${roomId}`)

                const newPlayer = await Player.create(playerId)
                currentRoom.addPlayer(newPlayer)

                socket.join(roomId)   
                io.to(roomId).emit('joinedRoom', roomId, newPlayer.getState(playerId))
            } else {
                console.log(`Room ${roomId} full. Has player: ${currentRoom.hasPlayer(playerId)}. Players length vs max: ${currentRoom.players.length}, ${currentRoom.maxPlayers}`)
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