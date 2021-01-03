const mongoose = require('mongoose')

const pageGroupTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    pageGroupStructure: {
        type: Object,
        required: true
    },
    dataBlockTemplate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataBlockTemplate'
    }
})

const PageGroupTemplate = mongoose.model('PageGroupTemplate', pageGroupTemplateSchema)
module.exports = PageGroupTemplate