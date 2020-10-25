const mongoose = require('mongoose')

const pageTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
})

const PageTemplate = mongoose.model('PageTemplate', pageTemplateSchema)
module.exports = PageTemplate