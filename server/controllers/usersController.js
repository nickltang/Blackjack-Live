const User = require('../models/user.js');

exports.createUser = async(req, res) => {
    res.status(200).json({
        message: 'Create user success',
    });
}

exports.getUserInfo = async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.status(200).json({
        message: 'Get user info success',
    });
}

exports.updateUserInfo = async(req, res) => {
    res.status(200).json({
        message: 'Update user info success'
    });
}

exports.logIn = async(req, res) => {
    res.status(200).json({
        message: 'Log in successful'
    })
}

exports.logOut = async(req, res) => {
    res.status(200).json({
        message: 'Log out successful'
    })
}
