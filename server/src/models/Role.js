const mongoose = require('mongoose')
const User = require('./User')

const RIGHTS = {
    ADMIN: "ADMIN",
    EDITOR: "EDITOR",
}

const ACTIONS = [
    "CREATE",
    "WRITE",
    "DELETE",
]

const OBJECT_TYPES = [
    "Page",
    "PageGroup",
    "User",
]


const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    permissions: [{
        object: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'permissions.objectType'
        },
        objectType: {
            type: String,
            enum: OBJECT_TYPES
        },
        actions: [{
            type: String
        }]
    }]
})


roleSchema.methods.allowsAccessToAction = async function(object, action) {
    for (const right in rights) {
        if (right.scope.contains(object)) {
            if (right.actions.contains(action)) {
                return true
            }
        }
    }

    return false
}

const Role = mongoose.model('Role', roleSchema)

module.exports = Role
