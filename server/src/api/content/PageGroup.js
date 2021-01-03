const express = require('express')
const Page = require('../../models/Page')
const PageGroup = require('../../models/PageGroup')
const PageGroupTemplate = require('../../models/PageGroupTemplate')

const auth = require('../../middleware/auth')
const DataBlock = require('../../models/DataBlock')
const DataBlockTemplate = require('../../models/DataBlockTemplate')

const getRoot = async (req, res) => {
    const pageGroup = await PageGroup.withPopulatedData(
        PageGroup.findOne({ name: '__main' })
    )
    if (!pageGroup) {
        return res.status(404).send({
            message: 'No root page group found, boy someone fucked up'
        })
    }
    return res.status(200).send(pageGroup)
}

const getPageGroup = async (req, res) => {
    const pageGroup = await PageGroup.withPopulatedData(
        PageGroup.findById(req.params.id)
    )
    return res.status(200).send(pageGroup)
}

const createPageGroup = async (req, res) => {
    const args = {
        name: req.body.name,
        parentGroup: req.body.parentGroup,
        template: req.body.template
    }
    Object.keys(args).forEach((key) => !args[key] ? delete args[key] : null)

    const pageGroup = new PageGroup(args)
    pageGroup.baseUrl = await pageGroup.getBaseUrl()

    let parentGroup = null
    if (args.parentGroup) {
        parentGroup = await PageGroup.findById(args.parentGroup)
        if (!parentGroup) {
            return res.status(400).send({
                message: `PageGroup with id ${args.parentGroup} does not exist`
            })
        }
        parentGroup.pageGroups = parentGroup.pageGroups.concat(pageGroup._id)
        await parentGroup.save()
    }

    let pgTemplate = null
    if (args.template) {
        
        pgTemplate = await PageGroupTemplate.findById(args.template).populate('dataBlockTemplate')
        if (!pgTemplate) {
            return res.status(400).send({
                message: `PageGroup template of id ${args.template} does not exist`
            })
        }
        
        // Create dataBlock to be used as shared data for the PageGroup
        const pgData = DataBlock.createFromTemplate(pgTemplate.dataBlockTemplate)
        pageGroup.dataBlock = pgData
        await pgData.save()

        // Add pages according to template
        const {pages = []} = pgTemplate.pageGroupStructure
        if (pages.length !== 0) {
            let pageTemplates = await DataBlockTemplate.find({ templateType: 'PAGE' })
            for (let i = 0; i < pages.length; i++) {
                const page = pages[i]
                const template = pageTemplates.find((pgt) => pgt.name === page.template)
                const newPage = new Page({
                    name: page.name,
                    template: template,
                    parentGroup: pageGroup
                })
                newPage.url = await newPage.getUrl()
                const pageData = DataBlock.createFromTemplate(template)
                newPage.dataBlock = pageData
                await pageData.save()
                await newPage.save()
                pageGroup.pages = pageGroup.pages.concat(newPage._id)
            }
        }
    }

    pageGroup.path = await pageGroup.getPath()
    await pageGroup.save()

    return res.status(201).send(pageGroup)
}

const modifyPageGroup = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = PageGroup.allowedUpdates()

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            message: 'Invalid updates provided'
        })
    }

    try {
        const pageGroup = await PageGroup.findById(req.params.id)
        updates.forEach((update) => {
            pageGroup[update] = req.body[update]
        })
        await pageGroup.save()
        return res.status(200).send(pageGroup)
    }
    catch (e) {
        return res.status(500).send(e)
    }
}

const deletePageGroup = async (req, res) => {
    const pageGroup = await PageGroup.findById(req.params.id).populate('parentGroup')
    if (!pageGroup) {
        return res.status(404).send({
            message: `PageGroup with id ${req.params.id} does not exist`
        })
    }

    // Delete entry from parent's pageGroups array
    const parentGroup = pageGroup.parentGroup
    parentGroup.pageGroups = parentGroup.pageGroups.filter(
        (pg) => pg._id.toString() !== pageGroup._id.toString()
    )
    
    await parentGroup.save()
    await pageGroup.remove()

    return res.status(200).send(pageGroup)
}

const updateData = async (req, res) => {
    try {
        const pg = await PageGroup.withPopulatedData(
            PageGroup.findById(req.params.id)
        )
        const dataBlock = pg.dataBlock
        dataBlock.data = req.body.data
        await dataBlock.save()
        return res.status(200).send(pg)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
}

const getTemplates = async (req, res) => {
    const pgTemplates = await PageGroupTemplate.find({}).populate('dataBlockTemplate')
    return res.status(200).send(pgTemplates)
}

const router = new express.Router()
router.get('/template', auth, getTemplates)
router.get('/root', auth, getRoot)
router.post('/updateData/:id', auth, updateData)
router.get('/:id', auth, getPageGroup)
router.post('/', auth, createPageGroup)
router.put('/:id', auth, modifyPageGroup)
router.delete('/:id', auth, deletePageGroup)

module.exports = router