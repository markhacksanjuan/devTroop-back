const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema (
    {
        fromUserId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        toUserId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        message: String
    },
    {
        timestamps: true
    }
)

const Message = mongoose.model('Message', messageSchema)
module.exports = Message