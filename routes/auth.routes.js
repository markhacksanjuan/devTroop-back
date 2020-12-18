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
const functions = require('../functions/functions')
const cp = require('cookie-parser')

router.post('/signup', (req, res, next) => {
    const { email, password, email2 } = req.body
    let newUser = req.body

    if(!email || !password) {
        res.json({ errorMessage: 'Tienes que introducir un email y una contraseña' })
        return
    }
    if(password.length < 6){
        res.json({ errorMessage: 'Deberías hacer la contraseña un poco más larga (6 minimo)'})
        return
    }
    if(!functions.isEmail(email)){
        res.send({errorMessage: 'Tienes que introducir un e-mail válido'})
        return
    }
    if(email !== email2){
        res.send({errorMessage: 'Los e-mails introducidos no son iguales'})
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
            res.status(500).send({ message: 'Something went wrong authenticating user' })
            return
        }
        if(!theUser) {
            res.send(failureDetails)
            return
        }
        req.login(theUser, (err) => {
            if(err) {
                res.send({ message: 'Session save went bad' })
                return
            }

            res.cookie('sameSite', 'none', {
                sameSite: true,
                secure: true
            })
            res.status(200).json(theUser)
            res.end()
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
router.post('/resend', (req, res, next) => {
    const { email } = req.body
    if(email === ''){
        res.send({errorMessage: 'Tienes que introducir un e-mail'})
        return
    }
    if(!functions.isEmail(email)){
        res.send({errorMessage: 'Tienes que introducir un e-mail válido'})
        return
    }
    User.findOne({ email })
        .then(user => {
            if(!user){
                res.send({errorMessage: 'No hemos encontrado a ningún ususario con éste e-mail'})
                return
            }
            if(user.isVerified){
                res.send({errorMessage: 'Este usuario ya ha sido verificado'})
                return
            }
            const newToken = {
                userId: user._id,
                token: crypto.randomBytes(16).toString('hex')
            }
            Token.create(newToken)
                .then(tokenCreated => {
                    const message = emails.createTokenEmail(user, tokenCreated)
                    transporter.sendMail({
                        from: 'DevTroop <teamtolearn.webapp@gmail.com>',
                        to: user.email,
                        subject: 'Tu cuenta necesita ser verificada',
                        html: message
                    })
                    .then(info => {
                        res.send(info)
                    })
                })
        })
        .catch(err => {
            console.error(err)
            res.send(err)
        })
    
})
router.post('/resetPwd', (req, res, next) => {
    const { email } = req.body
    if(email === ''){
        res.send({errorMessage: 'Tienes que introducir un e-mail'})
        return
    }
    if(!functions.isEmail(email)){
        res.send({errorMessage: 'Tienes que introducir un e-mail válido'})
        return
    }
    const newPwdResetToken = crypto.randomBytes(16).toString('hex')
    const hour = 1
    const date = Date.now() + hour*3600*1000
    User.findOneAndUpdate({ email }, {passwordResetToken: newPwdResetToken, passwordResetExpires: date})
        .then(user => {
            if(!user){
                res.send({errorMessage: 'No hemos encontrado a ningún usuario con éste e-mail'})
                return
            }
            const message = emails.createResetTokenPwd(user, newPwdResetToken)
            transporter.sendMail({
                from: 'DevTroop <teamtolearn.webapp@gmail.com>',
                to: user.email,
                subject: 'Obtener nueva contraseña',
                html: message
            })
            .then(info => res.send(info))
        })
        .catch(err => console.error(err))
})
router.post('/resetPwd/check', (req, res, next) => {
    const { email, token } = req.body
    User.findOne({ email })
        .then(user => {
            if(!user){
                res.send({errorMessage: 'El usuario no existe'})
                return
            }
            if(user.passwordResetToken === token && user.passwordResetExpires > Date.now()){
                res.send({errorMessage: '¡Eres un pringui, se te pasó el tiempo!'})
            }
        })
        .catch(err => {
            console.error(err)
        })
})
router.post('/resetPwd/newPwd', (req, res, next) => {
    const { email, newPassword } = req.body
    if(password.length < 6){
        res.json({ errorMessage: 'Deberías hacer la contraseña un poco más larga (6 minim)'})
        return
    }
    bcrypt.genSalt(bcryptSalt)
        .then(salt => {
            bcrypt.hash(newPassword, salt)
                .then(hashedPwd => {
                    User.findOneAndUpdate({ email }, {password: hashedPwd})
                        .then(result => result)
                })
        })
        .catch(err => console.error(err))
})



module.exports = router