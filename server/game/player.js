const User = require('../models/user.js');
const {parse, stringify, toJSON, fromJSON} = require('flatted');


class Player {
        constructor(id, socket) {
            this.user = User.findOne({id: id})
            this.id = id;
            this.socket = socket;
            this.balance = 1000
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

        getState() {
            return {
                id: this.id,
                name: this.user.name,
                balance: this.user.balance
            }
        }
    }

    module.exports = {
        Player
    }