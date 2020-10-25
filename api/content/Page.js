const express = require('express')
const Page = require('../../models/Page')
const PageGroup = require('../../models/PageGroup')
const PageTemplate = require('../../models/PageTemplate')

const router = new express.Router()

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
        const page = await Page.findById(req.param.id)
        await page.remove()

        return res.status(200).send(page)
    }
    catch (e) {
        return res.status(500).send(e)
    }
}



router.get('/:id', createPage)
router.put('/:id', modifyPage)