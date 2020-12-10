const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema (
    {
        name: {
            type: String
        },
        lastName: {
            type: String
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        imgName: {
            type: String,
            default: ''
        },
        imgPath: {
            type: String,
            default: ''
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        friends: {
            type: [Schema.Types.ObjectId],
            ref: 'User'
        },
        askedFriendship: {
            type: [Schema.Types.ObjectId],
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)
module.exports = User