const express = require('express')
const router = express.Router()
const User = require('../models/user.model')

//--- ROUTES FOR USER ---
router.post('/add-new-friend', (req, res, next) => {
    const user = req.user
    const { friendID } = req.body
    User.findById(user._id)
        .then(user => {
            if(!user.friends.includes(friendID)){
                User.findOneAndUpdate({_id: user._id}, {$push: {friends: friendID}})
                    .then(result => {
                        res.status(200).json(result)
                    })
            }else {
                res.status(400).json({message: 'Ya es tu amigo'})
            }
        })
        .catch(err => console.error(err))
})
router.post('/all', (req, res, next) => {
    const { userID } = req.body
    User.findById({_id: userID})
        .populate('friends')
        .then(foundUser => {
            res.status(200).json(foundUser.friends)
        })
        .catch(err => console.error(err))
})



module.exports = router