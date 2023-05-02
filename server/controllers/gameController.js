// Database
const User = require('../models/user')

// Endpoints
exports.createGame = async(req, res) => {
    // Create player
    // Create table with player

    res.status(200).json({
        message: 'Create game successful'
    })
}

exports.joinGame = async(req, res) => {
    // Create player

    // Join table with player
    
    res.status(200).json({
        message: 'Join game successful'
    })
}

exports.leaveGame = async(req, res) => {
    // Leave table with player

    // Update database with final 
    res.status(200).json({
        message: 'Leave game successful'
    })
}