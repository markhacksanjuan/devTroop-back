const express = require('express')
const router = express.Router()
const User = require('../models/user.model')
const { checkForAuthentication } = require('../configs/authentication.config')

router.get('/', (req, res, next) => {
    res.send('INDEX PAGE')
})

module.exports = router