const User = require('../models/user.js');
const {parse, stringify, toJSON, fromJSON} = require('flatted');


class Player {
        constructor(id, socket, mongoUser) {
            this.id = id;
            this.socket = socket;
            this.mongoUser = mongoUser;
            this.balance = mongoUser.balance
        }

        // Mongodb-related async preprocessing 
        static async init(id) {
            return await User.findOne({_id: id})
        }

        // Async create function that lets you preprocess mongodb before creating player
        static async create(id, socket) {
            const mongoUser = await Player.init(id)
            const newPlayer = new Player(id, socket, mongoUser)
            return newPlayer
        }


        async incBalanceReturnUser(id, bet) {
            console.log(`Updating player ${id} by ${bet}`)
            this.balance += bet
            console.log('balance:', this.balance)
            return await User.findOneAndUpdate({_id: id}, {$inc: {balance: bet}}, {new: true})
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
                name: this.mongoUser.name,
                balance: this.balance
            }
        }
    }

    module.exports = {
        Player
    }