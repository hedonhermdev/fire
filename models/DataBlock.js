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
    index: {
        type: Number,
        required: true,
        default: 0
    },
    data: {
        type: Object,
        required: true
    }
})

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
            if (template[key].contentType != undefined) {
                if (jsType(template[key].contentType) != typeof dataVal) {
                    return false
                }
                console.log(`property ${key} matches`)
            }
            // Otherwise we're dealing with either a single nested "block" or an array
            // of such blocks.
            else {
                if (typeof dataVal != 'object') {
                    return false
                }

                const meta = template[key]._meta
                if (!meta) {
                    return false
                }

                if (typeof (meta.quantity) === 'number') {
                    if (meta.quantity === 1) {
                        if (!compareWithTemplateHelper(template[key], dataVal)) {
                            return false
                        }
                    }
                    else {
                        if ((!Array.isArray(dataVal)) ||
                            (dataVal.length != meta.quantity)) {
                                return false
                            }
                        
                        let isValid = dataVal.every((val) => compareWithTemplateHelper(template[key], val))
                        if (!isValid) {
                            return false
                        }
                    }
                }
                else if (typeof (meta.quantity) === 'object') {
                    const min = meta.quantity.min, max = meta.quantity.max

                    // If the value is not an array or is an array not satisfying
                    // the size constraints, return false straight away
                    if (!Array.isArray(dataVal)) {
                        return false
                    }
                    if ((max && dataVal.length > max) ||
                        (min && dataVal.length < min)) {
                        return false
                    }

                    // If unlimited number of items are allowed, don't verify
                    // all of them, just check a random one. Bad, I know, but
                    // this whole verification is just an extra precaution and
                    // we surely don't wanna let it slow everything down.
                    if (!max) {
                        const idx = parseInt(Math.random() * dataVal.length)
                        if (!compareWithTemplateHelper(template[key], dataVal[idx])) {
                            return true
                        }
                        continue
                    }

                    let isValid = dataVal.every((val) => compareWithTemplateHelper(template[key], val))
                    if (!isValid) {
                        return false
                    }
                }
            }
        }
    }
    return true
}

dataBlockSchema.statics.compareWithTemplate = function (template, data) {
    const isValid = compareWithTemplateHelper(template, data)
    return isValid
}

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