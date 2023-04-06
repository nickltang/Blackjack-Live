// Database


// Endpoints
exports.createGame = async(req, res) => {
    res.status(200).json({
        message: 'Create game successful'
    })
}

exports.joinGame = async(req, res) => {
    res.status(200).json({
        message: 'Join game successful'
    })
}

exports.leaveGame = async(req, res) => {
    res.status(200).json({
        message: 'Leave game successful'
    })
}