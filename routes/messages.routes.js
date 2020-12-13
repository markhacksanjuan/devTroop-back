const express = require('express')
const router = express.Router()
const Message = require('../models/message.model')

// ----- ROUTES FOR MESSAGE -------
router.post('/create/:toUserId', (req, res, next) => {
    // const user = req.user
    const toUserId = req.params.toUserId
    const { message, fromUserId } = req.body
    const newMessage = {
        fromUserId,
        toUserId,
        message
    }
    Message.create(newMessage)
        .then(messageCreated => {
            res.status(200).json(messageCreated)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.post('/all/:toUserId', (req, res, next) => {
    const user = req.user
    const { toUserId } = req.params
    const { fromUserId } = req.body
    Message.find({$and: [{toUserId},{fromUserId}]})
        .then(messages => {
            res.status(200).json(messages)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.post('/all', (req, res, next) => {
    const { userId } = req.body
    Message.find({$or: [{fromUserId: userId}, {toUserId: userId}]})
        .populate('fromUserId')
        .then(messages => {
            res.status(200).json(messages)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})


module.exports = router