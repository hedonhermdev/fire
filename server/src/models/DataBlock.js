const { create } = require('lodash')
const mongoose = require('mongoose')
const DataBlockTemplate = require('./DataBlockTemplate')

const dataBlockSchema = new mongoose.Schema({
    data: {
        type: Object,
        required: true
    },
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DataBlockTemplate',
        required: true
    }
})

dataBlockSchema.statics.allowedUpdates = function () {
    return ['index', 'data']
}

const jsType = (type) => {
    switch (type) {
        case 'text': return 'string'
        case 'richtext': return 'string'
        case 'image': return 'string'
        default: return null
    }
}

const compareWithTemplateHelper = (template, data) => {
    const templateKeys = Object.keys(template)

    for (let i = 0; i < templateKeys.length; i++) {
        let key = templateKeys[i]
        // Ignore the _meta attribute
        if (key === '_meta') {
            continue
        }

        // Return false if a key exists in the template
        // but not in the data
        const dataVal = data[key]
        if (dataVal === null || dataVal === undefined) {
            return false
        }

        if (typeof template[key] === 'string') {
            if (jsType(template[key]) != typeof data[key]) {
                return false
            }
            console.log(`property ${key} matches`)
        }
        else if (typeof template[key] === 'object') {
            // If the value against the templateKey is an object which contains the
            // key "contentType", this value is equivalent to a value like 'richtext',
            // 'text' or 'image'.
            if (template[key].contentType !== undefined) {
                if (jsType(template[key].contentType) !== typeof dataVal) {
                    return false
                }
                console.log(`property ${key} matches`)
            }
            // Otherwise we're dealing with either a single nested "block" or an array
            // of such blocks.
            else {
                if (typeof dataVal != 'object') {
                    console.log(`property ${key} failed 1`)
                    return false
                }

                const meta = template[key]._meta
                if (!meta) {
                    console.log(`property ${key} failed 2`)
                    return false
                }

                if (typeof (meta.quantity) === 'number') {
                    if (meta.quantity === 1) {
                        if (!compareWithTemplateHelper(template[key], dataVal)) {
                            console.log(`property ${key} failed 3`)
                            return false
                        }
                    }
                    else {
                        if ((!Array.isArray(dataVal)) ||
                            (dataVal.length !== -1 && dataVal.length !== meta.quantity)) {
                                console.log(`property ${key} failed 4`)
                                return false
                            }
                        
                        let isValid = dataVal.every((val) => compareWithTemplateHelper(template[key], val))
                        if (!isValid) {
                            console.log(`property ${key} failed 5`)
                            return false
                        }
                    }
                }
                else if (typeof (meta.quantity) === 'object') {
                    const min = meta.quantity.min, max = meta.quantity.max

                    // If the value is not an array or is an array not satisfying
                    // the size constraints, return false straight away
                    if (!Array.isArray(dataVal)) {
                        console.log(`property ${key} failed 6`)
                        return false
                    }
                    if ((max && dataVal.length > max) ||
                        (min && dataVal.length < min)) {
                            console.log(`property ${key} failed 7`)
                        return false
                    }

                    // If unlimited number of items are allowed, don't verify
                    // all of them, just check a random one. Bad, I know, but
                    // this whole verification is just an extra precaution and
                    // we surely don't wanna let it slow everything down.
                    if (!max) {
                        if (dataVal.length > 0) {
                            const idx = parseInt(Math.random() * dataVal.length)
                            if (!compareWithTemplateHelper(template[key], dataVal[idx])) {
                                return true
                            }
                        }
                        continue
                    }

                    let isValid = dataVal.every((val) => compareWithTemplateHelper(template[key], val))
                    if (!isValid) {
                        console.log(`property ${key} failed 8`)
                        return false
                    }
                }
            }
        }
    }
    return true
}

dataBlockSchema.statics.compareWithTemplate = function (template, data) {
    return compareWithTemplateHelper(template, data)
}

function createFromTemplateHelper (template) {
    const result = {}
    
    // because the first level will not have a meta field
    if (!template._meta) {
        template._meta = {
            quantity: 1
        }
    }

    Object.entries(template).forEach(([key, val]) => {
        if (key === '_meta') {
            return

        }
        
        if ((typeof val === 'string') ||
            (typeof val === 'object' && val.contentType)) {
            return result[key] = ""
        }

        const meta = val._meta
        const quantity = meta.quantity
        if (quantity === 1) {
            return result[key] = createFromTemplateHelper(val)
        }

        let iterations = 1
        if (typeof quantity === 'number' && quantity !== -1) {
            iterations = quantity
        }
        else if (typeof quantity.min === 'number') {
            iterations = quantity.min
        }
        const newSubData = []
        for (let i = 0; i < iterations; i++) {
            newSubData.push(createFromTemplateHelper(val))
        }
        return result[key] = newSubData
    })

    return result
}

dataBlockSchema.statics.createFromTemplate = function (template) {
    const data = createFromTemplateHelper(template.structure)
    const datablock = new DataBlock({ data, template: template })
    return datablock
}


dataBlockSchema.methods.performValidation = async function () {

    if (!this.populated('template')) {
        await this.populate('template').execPopulate()
    }
    const dataBlockTemplate = this.template.structure
    if (!this.template) {
        const err = new Error('Datablock Template not found')
        err.status = 400
        throw err
    }

    const dataIsValid = DataBlock.compareWithTemplate(dataBlockTemplate, this.data)
    if (!dataIsValid) {
        const err = new Error(`Invalid data structure`)
        err.status = 400
        throw err
    }
}

dataBlockSchema.pre('save', async function (next) {
    await this.performValidation()
    next()
})

const DataBlock = mongoose.model('DataBlock', dataBlockSchema)
module.exports = DataBlock


///////////// DON'T REMOVE YET

// const template = {
//     name: 'text',
//     number: 'text',
//     address: {
//         contentType: 'text'
//     },
//     card: {
//         _meta: {
//             quantity: 1
//         },
//         title: 'text',
//         content: 'richtext',
//         moreData: {
//             _meta: {
//                 quantity: {
//                     min: 1,
//                     max: 5
//                 }
//             },
//             foo: 'text'
//         }
//     }
// }

// const res = createFromTemplateHelper(template)
// console.log(res)

// const data = {
//     name: '',
//     number: '6377653833',
//     address: 'you wish you knew',
//     card: {
//         title: 'education',
//         content: 'none',
//         moreData: [
//             {foo: 'henlo'},
//             {foo: 'friend'}
//         ]
//     }
// }

// console.log(compareWithTemplateHelper(template, data))