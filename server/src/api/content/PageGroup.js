const express = require('express')
const Page = require('../../models/Page')
const PageGroup = require('../../models/PageGroup')
const PageGroupTemplate = require('../../models/PageGroupTemplate')

const getPageGroup = async (req, res) => {
    const pageGroup = await PageGroup.withPopulatedData(Page.findById(req.params.id))
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
    let pgTemplate = null

    if (args.template) {
        pgTemplate = await PageGroupTemplate.findById(template)
        if (!pgTemplate) {
            return res.status(400).send({
                message: `PageGroup template of id ${template} does not exist`
            })
        }
    }

    if (pgTemplate) {
        // TODO: add pages according to template
    }

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
    const pageGroup = await PageGroup.findById(req.params.id)
    if (!pageGroup) {
        return res.status(404).send({
            message: `PageGroup with id ${req.params.id} does not exist`
        })
    }
    await pageGroup.remove()

    return res.status(200).send(pageGroup)
}

const router = new express.Router()
router.get('/:id', getPageGroup)
router.post('/:id', createPageGroup)
router.put('/:id', modifyPageGroup)
router.delete('/:id', deletePageGroup)

module.exports = router