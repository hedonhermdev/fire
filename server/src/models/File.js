const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    filename: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
})

const File = mongoose.model('File', fileSchema)

module.exports = File
