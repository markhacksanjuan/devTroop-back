const express = require('express')
const router = express.Router()
const User = require('../models/user.model')
const uploadCloud = require('../configs/cloudinary.config')

//--- ROUTES FOR USER ---
router.post('/add-new-friend', (req, res, next) => {
    const { userId, friendID } = req.body
    User.findById(userId)
        .then(user => {
            if(!user.friends.includes(friendID)){
                User.findOneAndUpdate({_id: userId}, {$push: {friends: friendID}})
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
router.post('/getOne', (req, res, next) => {
    const { userID } = req.body
    User.findById({_id: userID})
        .populate('friends')
        .then(foundUser => {
            res.status(200).json(foundUser)
        })
})
router.get('/allUsers', (req, res, next) => {
    User.find({})
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => console.error(err))
})
router.post('/editAvatar/:userId', uploadCloud.single('avatar'), (req, res, next) => {
    const { path, originalname } = req.file
    const { userId } = req.params

    const editedUser = {
        imgName: originalname,
        imgPath: path
    }
    User.findOneAndUpdate({_id: userId}, editedUser)
        .then(() => {
            res.status(200).send(path)
        })
        .catch(err => {
            console.error(err)
        })
})
router.post('/editUser', (req, res, next) => {
    const { editedUser, userId } = req.body
    
    User.findOneAndUpdate({_id: userId}, editedUser)
        .then((response) => {

            res.status(200).send(editedUser)
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })

})
router.post('/deleteFriend', (req, res, next) => {
    const { userId, friendId } = req.body
    User.findById({_id: userId})
        .then(user => {
            const newFriendsArr = user.friends.filter(friend => {
                return friend.toString() !== friendId.toString()
            })
            User.findOneAndUpdate({_id: userId}, {friends: newFriendsArr})
                .then(() => {
                    res.status(200).json(friendId)
                })
                .catch(err => {
                    res.json(err)
                })
        })
})



module.exports = router