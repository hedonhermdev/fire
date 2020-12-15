const mongoose = require('mongoose')

const datablockTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    }
})

const DataBlockTemplate = mongoose.model('DataBlockTemplate', datablockTemplateSchema)
module.exports = DataBlockTemplate