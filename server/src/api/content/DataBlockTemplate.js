const express = require('express')
const DataBlockTemplate = require('../../models/DataBlockTemplate')

const auth = require('../../middleware/auth')

const getPageTemplates = async (req, res) => {
    const pageTemplates = await DataBlockTemplate.find({ templateType: 'PAGE' }).select('name _id')
    return res.status(200).send(pageTemplates)
}

const getPgTemplates = async (req, res) => {
    const pgTemplates = await DataBlockTemplate.find({ templateType: 'PAGE_GROUP' }).select('name _id')
    return res.status(200).send(pgTemplates)
}

const router = new express.Router()
router.get('/page', auth, getPageTemplates)
router.get('/pageGroup', auth, getPgTemplates)

module.exports = router