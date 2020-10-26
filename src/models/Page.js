const mongoose = require("mongoose")
const PageGroup = require('./PageGroup')
const PageTemplate = require('./PageTemplate')

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
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageTemplate',
        required: true
    },
    parentGroup: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageGroup',
        default: null
    }
})

pageSchema.statics.allowedUpdates = () => {
    return ['name', 'active', 'parentGroup']
}

pageSchema.methods.performValidation = async function () {
    const err = new Error('bad request')
    err.status = 400

    if (this.isModified('template')) {
        const templateExists = await PageTemplate.exists({ _id: this.template })
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

pageSchema.pre('save', async function (next) {
    await this.performValidation()

    const pageGroup = await PageGroup.findById(this.parentGroup)
    let parentUrl = pageGroup ? pageGroup.baseUrl : ''

    if (parentUrl === '') {
        this.url = this.name
    }
    else {
        if (this.name === 'index') {
            this.url = parentUrl
        }
        else {
            this.url = `${parentUrl}/${this.name}`
        }
    }
    next()
})

const Page = mongoose.model('Page', pageSchema)
module.exports = Page