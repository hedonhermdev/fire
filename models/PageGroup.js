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
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageGroupTemplate'
    },
    pages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page'
    }]
})

const PageGroup = mongoose.model('PageGroup', pageGroupSchema)
module.exports = PageGroup