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
            default: 'user0'
        },
        imgPath: {
            type: String,
            default: 'https://res.cloudinary.com/dbmvibcpr/image/upload/v1607729996/devtroop/user0.png'
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
        },
        doubts: {
            type: [Schema.Types.ObjectId],
            ref: 'Doubt'
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)
module.exports = User