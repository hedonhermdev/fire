const mongoose = require('mongoose')
const Page = require('./Page')

const pageGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    baseUrl: {
        type: String
    },
    parentGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageGroup'
    },
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageGroupTemplate'
    },
    pageGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageGroup'
    }],
    pages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page'
    }],
    dataBlock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataBlock'
    },
    path: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageGroup'
    }]
})

pageGroupSchema.statics.allowedUpdates = function () {
    return ['name']
}

pageGroupSchema.statics.withPopulatedData = async function(query) {
    const pg = await query.populate({
        path: 'pageGroups',
        model: 'PageGroup',
        select: '_id name'
    }).populate({
        path: 'pages',
        model: 'Page',
        select: '_id name active'
    }).populate({
        path: 'dataBlock',
        model: 'DataBlock',
        populate: {
            path: 'template',
            model: 'DataBlockTemplate'
        }
    }).populate({
        path: 'path',
        model: 'PageGroup',
        select: '_id name'
    })

    return pg
}

pageGroupSchema.methods.getPath = async function() {
    if (!this.parentGroup) {
        return []
    }

    if (!this.parentGroup.path) {
        await this.populate('parentGroup').execPopulate()
    }

    const path = this.parentGroup.path.concat(
        this.parentGroup._id
    )

    return path
}

pageGroupSchema.methods.getBaseUrl = async function() {
    if (!this.parentGroup) {
        if (this.name = '__main') {
            return ''
        }
        return this.name
    }

    let parentUrl = ''
    if (!this.populated('parentGroup')) {
        const parentGroup = await PageGroup.findById(this.parentGroup)
        parentUrl = parentGroup.baseUrl
    }
    else {
        parentUrl = this.parentGroup.baseUrl
    }

    if (parentUrl === '') {
        return this.name
    }

    return `${parentUrl}/${this.name}`
}

pageGroupSchema.pre('save', async function(next) {
    this.baseUrl = await this.getBaseUrl()
    next()
})



const PageGroup = mongoose.model('PageGroup', pageGroupSchema)
module.exports = PageGroup