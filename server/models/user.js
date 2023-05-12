const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 1000,
    }
})

// User.methods.matchPassword = async (enteredPassword) => {
//     return await bcrypt.compare(enteredPassword, this.password)
// }

module.exports = mongoose.model('User', User)