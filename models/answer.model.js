const mongoose = require('mongoose')
const Schema = mongoose.Schema

const answerSchema = new Schema (
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        doubtId: {
            type: Schema.Types.ObjectId,
            ref: 'Doubt'
        },
        aswer: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

const Answer = mongoose.model('Answer', answerSchema)
module.exports = Answer