const express = require('express')
const Role = require('../../models/Role')

const auth = require('../../middleware/auth')

const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body

        console.log(permissions)

        const role = new Role({
            name, permissions
        })

        await role.save()

        return res.status(201).send(role)
    }
    catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
}

const addUserToRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id)
        const user = req.user
        user.roles.push(role)
        
        await user.save()
        return res.status(200).send(user)
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
}

const removeUserFromRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate(path)
        const user = req.user
        
        user.roles.pull(role)
        await user
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
}

const getRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id)
        if (role == null) {
            return res.status(404).send(e)
        }
        return res.status(200).send(role)
    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
}

const router = new express.Router()
router.post('/', createRole)
router.post('/add/:id', auth, addUserToRole)
router.post('/remove/:id', auth, removeUserFromRole)
router.get('/:id', auth, getRole)

module.exports = router
