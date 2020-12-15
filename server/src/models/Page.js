const mongoose = require("mongoose")
const PageGroup = require('./PageGroup')
const DataBlockTemplate = require('./DataBlockTemplate')

const pageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    parentGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageGroup',
        default: null
    },
    data: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataBlock'
    }
})

pageSchema.statics.allowedUpdates = () => {
    return ['name', 'active']
}

pageSchema.methods.performValidation = async function () {
    const err = new Error('bad request')
    err.status = 400

    if (this.isModified('template')) {
        const templateExists = await DataBlockTemplate.exists({ _id: this.template })
        if (!templateExists) {
            err.message = `Template with id ${this.template.toString()} does not exist`
            throw err
        }
    }

    if (this.isModified('parentGroup')) {
        if (this.parentGroup) {
            const parentGroupExists = await PageGroup.exists({ _id: this.parentGroup })
            if (!parentGroupExists) {
                err.message = `PageGroup with id ${this.parentGroup.toString()} does not exist`
                throw err
            }
        }
    }
}

pageSchema.methods.getUrl = async function() {
    if (!this.populated('parentGroup')) {
        await this.populate('parentGroup').execPopulate()
    }

    let parentUrl = this.parentGroup ? this.parentGroup.baseUrl : ''

    if (parentUrl === '') {
        return this.name
    }
    
    if (this.name === 'index') {
        return parentUrl
    }

    return `${parentUrl}/${this.name}`
}

pageSchema.pre('save', async function (next) {
    await this.performValidation()
    this.url = await this.getUrl()
    next()
})

const Page = mongoose.model('Page', pageSchema)
module.exports = Page