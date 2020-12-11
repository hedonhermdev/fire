const express = require('express')
const Page = require('../../models/Page')
const PageGroup = require('../../models/PageGroup')
const PageGroupTemplate = require('../../models/PageGroupTemplate')

const getPageGroup = async (req, res) => {
    const pageGroup = await PageGroup.withPopulatedData(PageGroup.findById(req.params.id))
    console.log(req.params.id)
    console.log(pageGroup)
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
        console.log(parentGroup)
        parentGroup.pageGroups = parentGroup.pageGroups.concat(pageGroup._id)
    }

    let pgTemplate = null
    if (args.template) {
        pgTemplate = await PageGroupTemplate.findById(args.template)
        if (!pgTemplate) {
            return res.status(400).send({
                message: `PageGroup template of id ${args.template} does not exist`
            })
        }
        // TODO: add pages according to template
    }


    await pageGroup.save()
    await parentGroup.save()
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

const router = new express.Router()
router.get('/:id', getPageGroup)
router.post('/', createPageGroup)
router.put('/:id', modifyPageGroup)
router.delete('/:id', deletePageGroup)

module.exports = router