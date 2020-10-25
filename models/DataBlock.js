const mongoose = require('mongoose')

const dataBlockSchema = new mongoose.Schema({
    page: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        required: true
    }
})

const DataBlock = mongoose.model('DataBlock', dataBlockSchema)
module.exports = DataBlock