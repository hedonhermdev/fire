const express = require('express')
const Page = require('../../models/Page')

const getPage = async (req, res) => {
    const page = await Page.findById(req.params.id)
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
        let parentGroup = null
        if (args.parentGroup) {
            page.parentGroup = args.parentGroup
            await page.populate('parentGroup').execPopulate()
            parentGroup = page.parentGroup
        }

        parentGroup.pages = parentGroup.pages.concat(page._id)
        page.url = await page.getUrl()

        await parentGroup.save()
        await page.save()
        return res.status(201).send(page)
    }
    catch (e) {
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
        const page = await Page.findById(req.params.id)
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


const router = new express.Router()
router.get('/:id', getPage)
router.post('/', createPage)
router.put('/:id', modifyPage)
router.delete('/:id', deletePage)

module.exports = router