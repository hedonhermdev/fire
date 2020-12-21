const express = require('express')
const User = require('../../models/User')

const auth = require('../../middleware/auth')

const signup = async (req, res) => {
    try {
        const { name, username, password } = req.body
        const user = new User({
            name, username, password
        })

        const token = user.generateAuthToken()
        user.tokens = user.tokens.concat(token)
        await user.save()

        return res.status(201).send({ user, token })
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

const login = async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = user.generateAuthToken()
        user.tokens = user.tokens.concat(token)
        await user.save()

        return res.status(200).send({ user, token })
    }
    catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
}

const logout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => (
            token.toString() !== req.token.toString()
        ))
        await req.user.save()
        return res.status(200).send()
    }
    catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
}


const router = new express.Router()
router.post('/signup', signup)
router.post('/login', login)
router.post('/logout', auth, logout)

module.exports = router