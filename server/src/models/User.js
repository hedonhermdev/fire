const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        type: String
    }]
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign(
        { _id: this._id.toString() }, process.env.JWT_SECRET || 'lolmao12345'
    )

    return token
}

userSchema.statics.findByCredentials = async function(username, password) {
    const user = await User.findOne({ username })
    const error = new Error('Invalid username or password')
    error.status = 401
    
    if (!user) {
        throw error
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw error
    }

    return user
}

userSchema.statics.findByToken = async function(token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lolmao12345')
    const user = await User.findOne({ _id: decoded._id, tokens: token })

    if (!user) {
        return null
    }

    return user
}

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
        this.tokens = []
    }
    next()
})

const User = mongoose.model('User', userSchema)
module.exports = User