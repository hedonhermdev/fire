const User = require('../models/User')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const user = await User.findByToken(token)
        console.log(user)

        if (!user) {
            throw new Error()
        }

        req.user = user
        req.token = token
        next()
    }
    catch (e) {
        res.status(401).send({
            message: 'Please authenticate first'
        })
        console.log(e)
    }
}

module.exports = auth
