const mongoose = require('mongoose')
const Schema = mongoose.Schema

const doubtSchema = new Schema (
    {
        title: {
            type: String
        },
        doubt: {
            type: String
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        answersId: {
            type: [Schema.Types.ObjectId],
            ref: 'Answer'
        }
    },
    {
        timestamps: true
    }
)

const Doubt = mongoose.model('Doubt', doubtSchema)
module.exports = Doubt