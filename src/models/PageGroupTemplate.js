const mongoose = require('mongoose')

const pageGroupTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
})

const PageGroupTemplate = mongoose.model('PageGroupTemplate', pageGroupTemplateSchema)
module.exports = PageGroupTemplate