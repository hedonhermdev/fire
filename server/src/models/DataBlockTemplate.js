const mongoose = require('mongoose')

const datablockTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    structure: {
        type: Object,
        required: true
    },
    templateType: {
        type: String,
        enum: ['PAGE_GROUP', 'PAGE'],
        default: 'PAGE'
    }
})

const DataBlockTemplate = mongoose.model('DataBlockTemplate', datablockTemplateSchema)
module.exports = DataBlockTemplate