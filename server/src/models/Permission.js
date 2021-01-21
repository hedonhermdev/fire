const mongoose = require('mongoose')

const ACTIONS = [
    "READ",
    "WRITE",
    "DELETE",
    "CREATE",
    "MODIFY",
]

const permissionSchema = {
    actions: [{type: String, enum: ACTIONS}],
    scope: [{
        type: mongoose.Schema.Types.ObjectId
    }]
}

const Permission = mongoose.Model('Permission', permissionSchema)

module.exports = Permission
