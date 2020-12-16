const express = require('express')
const router = express.Router()
const User = require('../models/user.model')
const { checkForAuthentication } = require('../configs/authentication.config')

router.get('/', (req, res, next) => {
    let cookieVal = null
    if(req.cookies['3pcookie']){
        cookieVal = req.cookies['3pcookie']
    }else if (req.cookies['3pcookie-legacy']){
        cookieVal = req.cookies['3pcookie-legacy']
    }
    res.send('INDEX PAGE')
    res.end()
})

module.exports = router