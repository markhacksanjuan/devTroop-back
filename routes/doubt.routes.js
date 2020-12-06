const express = require('express')
const router = express.Router()
const Doubt = require('../models/doubt.model')
const Answer = require('../models/answer.model')
const User = require('../models/user.model')

// ----------- ROUTES FOR DOUBTS ------------
router.post('/create', (req, res, next) => {
    const user = req.user
    const { title, doubt } = req.body
    const newDoubt = {
        userId: user._id,
        title,
        doubt
    }
    Doubt.create(newDoubt)
        .then(createdDoubt => {
            res.status(200).json(createdDoubt)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.get('/all', (req, res, next) => {
    Doubt.find({})
        .then(doubts => {
            res.status(200).json(doubts)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.get('/one/:id', (req, res, next) => {
    const id = req.params.id
    Doubt.find({_id: id})
        .then(doubt => {
            res.status(200).json(doubt)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.post('/one/:id', (req, res, next) => {
    const id = req.params.id
    const { title, doubt } = req.body
    Doubt.findOneAndUpdate({_id: id}, {title, doubt})
        .then(updatedDoubt => {
            res.status(200).json(updatedDoubt)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.post('/one/:id/delete', (req, res, next) => {
    const id = req.params.id
    Doubt.findOneAndRemove({_id: id})
        .then(deletedDoubt => {
            res.status(200).json(deletedDoubt)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})

// --- ROUTES FOR ANSWERS
router.get('/answers/all', (req, res, next) => {

})
router.get('/answers/one/:id', (req, res, next) => {

})
router.post('/answers/create', (req, res, next) => {

})
router.post('/answers/one/:id', (req, res, next) => {

})
router.post('/answers/one/:id/delete', (req, res, next) => {

})
router.get('/answers/all/:doubtId', (req, res, next) => {
    
})

module.exports = router