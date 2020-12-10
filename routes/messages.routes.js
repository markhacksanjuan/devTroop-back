const express = require('express')
const router = express.Router()
const Message = require('../models/message.model')

// ----- ROUTES FOR MESSAGE -------
router.post('/:toUserId/create', (req, res, next) => {
    const user = req.user
    const toUserId = req.params.toUserId
    const message = req.body
    const newMessage = {
        fromUserId: user._id,
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
router.get('/:toUserId', (req, res, next) => {
    const user = req.user
    const toUserId = req.params.toUserId
    Message.find.and([{toUserId},{fromUserId: user._id}])
        .then(messages => {
            res.status(200).json(messages)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})


module.exports = router