// Database
const User = require('../models/user')

// Endpoints
exports.createGame = async(req, res) => {
    const user = User.findById(req.user.id)

    if(!user) {
        res.status(400)
        throw new Error('User does not exist')
    }

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