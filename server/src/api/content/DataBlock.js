const express = require('express')
const DataBlock = require('../../models/DataBlock')
const Page = require('../../models/Page')

const createDataBlock = async (req, res) => {
    const { page, position, data } = req.body
    if (!page || !position || !data) {
        return res.status(400).send({
            message: 'Missing fields in request body. You need to provide "page", "position" and "data"'
        })
    }

    try {
        const numBlocks = await DataBlock.countDocuments({ page, position })
        const dataBlock = new DataBlock({
            page,
            position,
            data,
            index: numBlocks
        })
        await dataBlock.save()
    
        return res.status(201).send(dataBlock)
    }
    catch (e) {
        const status = e.status || 500
        return res.status(status).send({
            message: e.message
        })
    }
}

const getDataBlock = async (req, res) => {
    const dataBlock = await DataBlock.findById(req.params.id)
    if (!dataBlock) {
        return res.status(404).send({
            message: `DataBlock with id ${req.params.id} does not exist`
        })
    }

    return res.status(200).send(dataBlock)
}

const modifyDataBlock = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = DataBlock.allowedUpdates()

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(403).send({
            message: 'Invalid updates provided'
        })
    }

    const dataBlock = DataBlock.findById(req.params.id)
    if (!dataBlock) {
        return res.status(404).send({
            message: `DataBlock with id ${req.params.id} does not exist`
        })
    }

    try {
        updates.forEach((update) => {
            dataBlock[update] = req.body[update]
        })
        await dataBlock.save()
        return res.status(200).send(dataBlock)
    }
    catch (e) {
        const status = e.status || 500
        return res.status(status).send({
            message: e.message
        })
    }
}

const deleteDataBlock = async (req, res) => {
    const dataBlock = await DataBlock.findById(req.params.id)
    if (!dataBlock) {
        return res.status(404).send({
            message: `DataBlock with id ${req.params.id} does not exist`
        })
    }

    dataBlock.remove()
    return res.status(201).send(dataBlock)
}


const router = new express.Router()
router.post('/', createDataBlock)
router.get('/:id', getDataBlock)
router.put('/:id', modifyDataBlock)
router.delete('/:id', deleteDataBlock)

module.exports = router