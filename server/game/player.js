class Player {
    constructor(name, socket) {
      this.name = name;
      this.socket = socket;
    }
  
    // Listen for socket events related to the player
    listen() {
      this.socket.on('hit', () => {
        // Player hit
      });
  
      this.socket.on('stay', () => {
        // Player stayed
      });
  
      this.socket.on('disconnect', () => {
        console.log(`User ${this.name} disconnected`);
        // Remove player from game room
      });
    }
  }

  module.exports = {
    Player
  }