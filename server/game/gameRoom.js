const { Player } = require("player")

class GameRoom {    
    constructor(roomId) {
      this.roomId = roomId;
      this.maxPlayers = 2;
      this.players = [];
      this.game = new Game();
    }
  
    addPlayer(player) {
      if (this.players.length < this.maxPlayers) {
        this.players.push(player);
        player.emit('player joined', player.name);
        this.broadcast('update players', this.players.map(player => player.name));
        return true;
      }
      return false;
    }
  
    removePlayer(player) {
      this.players = this.players.filter(p => p !== player);
      player.emit('player left', player.name);
      this.broadcast('update players', this.players.map(player => player.name));
    }
  
    broadcast(event, data) {
      this.players.forEach(player => {
        player.emit(event, data);
      });
    }
  
    listen(io) {
      io.on('connection', socket => {
        // Handle player joining room
        socket.on('joinRoom', (playerName) => {
          const player = new Player(playerName, socket);
        
          if (this.addPlayer(player)) {
            player.listen(io, this);

            // Send current game state to newly joined player
            socket.emit("gameState", this.game.getState());
          } else {
            player.emit('room full');
          }
        });

        // Handle incoming actions from players
        socket.on("action", (action) => {
            // Check if game is over
            if (this.gameOver) {
            console.log("Game over. Cannot perform any more actions.");
            return;
            }

            // Dispatch the action to the game
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


      });


    }
  }


const initGameRooms = (io) => {
  const gameRooms = {};

  // Listen for socket events related to game room creation
  io.on('connection', (socket) => {

    socket.on('createGameRoom', (roomId) => {
      if (!gameRooms[roomId]) {
        // Create a new game room object
        const gameRoom = new GameRoom(roomId);

        // Store the game room object
        gameRooms[roomId] = gameRoom;

        // Listen for socket events related to the game room object
        gameRoom.listen(io);

        console.log(`Game room ${roomId} created`);
      }
    });


    socket.on('joinGameRoom', (roomId, playerId) => {
        // Locate game room object
        if (!gameRooms[roomId]) {
            socket.emit('Error', 'Game room not found')
        } else {
            const newPlayer = new Player(playerId, io)
            gameRooms[roomId].addPlayer
        }
    })

  });
};

module.exports = {
    GameRoom,
    initGameRooms
}