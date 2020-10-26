const mongoose = require('mongoose')

const pageGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    baseUrl: {
        type: String,
        required: true
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
    })

    return pg
}

const PageGroup = mongoose.model('PageGroup', pageGroupSchema)
module.exports = PageGroup