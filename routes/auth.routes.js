const express = require('express')
const router = express.Router()
const User = require('../models/user.model')
const Token = require('../models/token.model')
const bcrypt = require('bcrypt')
const passport = require('passport')
const crypto = require('crypto')
const emails = require('../functions/emails')
const transporter = require('../configs/nodemailer.config')
const bcryptSalt = 10

router.post('/signup', (req, res, next) => {
    const { email, password } = req.body
    let newUser = req.body

    if(!email || !password) {
        // res.status(400).send({ errorMessage: 'Provide email and password' })
        res.json({ errorMessage: 'Tienes que introducir un email y una contraseña' })
        return
    }
    if(password.length < 6){
        res.json({ errorMessage: 'Deberías hacer la contraseña un poco más larga (6 minim)'})
        return
    }

    User.findOne({ email: email })
        .then(user => {
            if(!user){
                bcrypt.genSalt(bcryptSalt)
                    .then(salt => {
                        bcrypt.hash(password, salt)
                        .then(hashedPwd => {
                            newUser = {
                                name: req.body.name,
                                lastName: req.body.lastName,
                                email,
                                password: hashedPwd
                            }
                        User.create(newUser)
                            .then(result => {
                                const newToken = {
                                    userId: result._id,
                                    token: crypto.randomBytes(16).toString('hex')
                                }
                            Token.create(newToken)
                                .then(tokenCreated => {
                                    const message = emails.createTokenEmail(result, tokenCreated)
                                    transporter.sendMail({
                                        from: `DevTroop <teamtolearn.webapp@gmail.com>`,
                                        to: result.email,
                                        subject: 'Tu cuenta necesita ser verificada',
                                        html: message
                                    })
                                    .then(info => {
                                        res.send(info)
                                    })
                                })
                            })
                        })
                    })
            }else {
                res.send({ errorMessage: 'El email introducido ya existe'})
            }
        })
        .catch(err => {
            console.error(err)
        })
})
router.get('/login', (req, res, next) => {
    res.status(200).send({errorMessage: req.flash('error')})
})
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, theUser, failureDetails) => {
        if(err) {
            // res.status(500).send({ message: 'Something went wrong authenticating user' })
            res.send({ message: 'Something went wrong authenticating user' })
            return
        }
        if(!theUser) {
            // res.status(401).send(failureDetails)
            res.json(failureDetails)
            return
        }
        req.login(theUser, (err) => {
            if(err) {
                // res.status(500).send({ message: 'Session save went bad' })
                res.send({ message: 'Session save went bad' })
                return
            }
            res.status(200).json(theUser)
        })
    })(req, res, next)
})
router.post('/logout', (req, res, next) => {
    req.logout()
    res.status(200).json({ message: 'Log out success! '})
})
router.get('/loggedin', (req, res, next) => {
    if(req.isAuthenticated()) {
        res.status(200).json(req.user)
        return
    }
    res.status(403).json({ message: 'Unauthorized' })
})



module.exports = router