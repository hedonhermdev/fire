const mongoose = require('mongoose')

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
    }
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
    })

    return pg
}

pageGroupSchema.methods.getBaseUrl = async function() {
    if (!this.parentGroup) {
        if (this.name = '__main') {
            return ''
        }
        return this.name
    }

    if (!this.populated('parentGroup')) {
        await this.populate({
            path: 'parentGroup',
            model: 'PageGroup',
            select: 'baseUrl'
        }).execPopulate()
    }

    const parentUrl = this.parentGroup.baseUrl
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