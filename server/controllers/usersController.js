// Database
const User = require('../models/user.js');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')


// Endpoints
exports.createUser = asyncHandler(async (req, res) => {
    const { username, name, email, password } = req.body

    if(!name || !email || !password || !username) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    // Check if user exists
    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
        username,
        name,
        email,
        password: hashedPassword,
        token: generateToken(user._id),
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            username: user.username,
            name: user.name,
            email: user.email
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})


exports.getUserInfo = asyncHandler(async (req, res) => {
    const { _id, username, name, email } = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        username: username,
        name: name,
        email: email,
    })
})


exports.updateUserInfo = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: 'Update user info success'
    });
})


exports.logIn = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    // Check for user email
    const user = await User.findOne({username})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            username: user.username,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        // throw new Error('Invalid credentials')
    }

    res.status(200).json({
        message: 'Log in successful'
    })
})



// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '5d',
    })
}
