const express = require('express')
const router = express.Router()
const Doubt = require('../models/doubt.model')
const Answer = require('../models/answer.model')
const User = require('../models/user.model')

// ----------- ROUTES FOR DOUBTS ------------
router.post('/create', (req, res, next) => {
    const user = req.user
    const { title, doubt, userId } = req.body
    const newDoubt = {
        userId,
        title,
        doubt
    }
    if(title === '' || doubt === ''){
        res.send({errorMessage: '¡Tienes que introducir un titulo y una duda!'})
        return
    }
    if(!userId){
        res.send({errorMessage: '¡Ouch, hemos tenido un error con el servidor!'})
        return
    }
    Doubt.create(newDoubt)
        .then(createdDoubt => {
            User.findOneAndUpdate({_id: userId}, {$push: {doubts: createdDoubt._id}})
            .then(result => {
                res.status(200).json(createdDoubt)
            })
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.get('/all', (req, res, next) => {
    Doubt.find({})
        .populate('userId')
        .sort({createdAt: -1})
        .then(doubts => {
            res.status(200).json(doubts)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.get('/all/:id', (req, res, next) => {
    const { id } = req.params
    Doubt.find({userId: id})
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
        .populate('userId')
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
    const newDoubt = {
        title,
        doubt
    }
    if(title === '' || doubt === ''){
        res.send({errorMessage: '¡Tienes que introducir una respuesta!'})
        return
    }
    Doubt.findOneAndUpdate({_id: id}, newDoubt)
        .then(() => {
            res.status(200).json(newDoubt)
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
router.get('/answer/all/:doubtId', (req, res, next) => {
    const doubtId = req.params.doubtId
    Answer.find({doubtId: doubtId})
        .then(answers => {
            res.status(200).json(answers)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.post('/answer/create/:doubtId', (req, res, next) => {
    const { doubtId } = req.params
    const { answer, userId} = req.body
    const newAnswer = {
        userId,
        doubtId,
        answer
    }
    if(answer === ''){
        res.send({errorMessage: '¡Tienes que introducir una respuesta!'})
        return
    }
    if(!userId){
        res.send({errorMessage: '¡Ouch, hemos tenido un error con el servidor!'})
        return
    }
    Answer.create(newAnswer)
        .then(createdAnswer => {
            Doubt.findOneAndUpdate({ _id: doubtId }, {$push: {answersId: createdAnswer._id}})
            res.status(200).json(createdAnswer)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.post('/answer/edit/:id', (req, res, next) => {
    const user = req.user
    const id = req.params.id
    const answer = req.body.answer
    Answer.findOneAndUpdate({_id: id}, {answer})
        .then(editedAnswer => {
            res.status(200).json(editedAnswer)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})
router.post('/answer/delete/:id', (req, res, next) => {
    const user = req.user
    const id = req.params.id
    Answer.findOneAndRemove({_id: id})
        .then(deletedAnswer => {
            res.status(200).json(deletedAnswer)
        })
        .catch(err => {
            console.error(err)
            res.json(err)
        })
})


module.exports = router