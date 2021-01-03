const express = require('express')
const Page = require('../../models/Page')
const DataBlock = require('../../models/DataBlock')
const DataBlockTemplate = require('../../models/DataBlockTemplate')

const getPage = async (req, res) => {
    const page = await Page.withPath(
        Page.findById(req.params.id).populate({
            path: 'dataBlock',
            select: 'data template',
            populate: {
                path: 'template',
                select: 'structure'
            }
        })
    )
    
    if (!page) {
        return res.status(404).send({
            message: `Page with id ${req.params.id} does not exist`
        })
    }

    console.log(page.data)
    return res.status(200).send(page)
}

const createPage = async (req, res) => {
    const args = {
        name: req.body.name,
        template: req.body.template
    }

    if (req.body.parentGroup) {
        args.parentGroup = req.body.parentGroup
    }

    try {
        const page = new Page(args)
        await Page.withPath(page).execPopulate()
        const parentGroup = page.parentGroup
        
        page.url = await page.getUrl()

        const dataBlockTemplate = await DataBlockTemplate.findById(args.template)
        const pageData = DataBlock.createFromTemplate(dataBlockTemplate)
        page.dataBlock = pageData
        await pageData.save()

        if (parentGroup) {
            parentGroup.pages = parentGroup.pages.concat(page._id)
            await parentGroup.save()
        }
        
        await page.save()
        return res.status(201).send(page)
    }
    catch (e) {
        console.log(e)
        return res.status(e.status || 500).send(e)
    }
}

const modifyPage = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = Page.allowedUpdates()

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({
            message: 'Invalid updates provided'
        })
    }

    try {
        const page = await Page.withPath(Page.findById(req.params.id))
        updates.forEach((update) => {
            page[update] = req.body[update]
        })
        await page.save()
        return res.status(200).send(page)
    }
    catch (e) {
        return res.status(e.status || 500).send(e)
    }
}

const deletePage = async (req, res) => {
    try {
        const page = await Page.findById(req.params.id).populate('parentGroup')
        if (!page) {
            return res.status(404).send({
                message: `Page with id ${req.params.id} does not exist`
            })
        }

        const parentGroup = page.parentGroup
        if (parentGroup) {
            parentGroup.pages = parentGroup.pages.filter(
                (p) => p._id.toString() !== page._id.toString()
            )
            await parentGroup.save()
        }

        await page.remove()

        return res.status(200).send(page)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
}

const updateData = async (req, res) => {
    try {
        const page = await Page.withPath(Page.findById(req.params.id).populate('dataBlock'))
        const dataBlock = page.dataBlock
        dataBlock.data = req.body.data
        console.log(req.body)
        await dataBlock.save()
        return res.status(200).send(page)
    } catch (e) {
        console.log(e)
        return res.status(500).send(e)
    }
}


const router = new express.Router()
router.get('/:id', getPage)
router.post('/', createPage)
router.post('/updateData/:id', updateData)
router.put('/:id', modifyPage)
router.delete('/:id', deletePage)

module.exports = router