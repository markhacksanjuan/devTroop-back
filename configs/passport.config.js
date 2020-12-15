const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user.model')
const bcrypt = require('bcrypt')

// --- SERIALIZE & DESERIALIZE USER ---
passport.serializeUser((user, next) => {
    next(null, user._id)
})
passport.deserializeUser((id, next) => {
    User.findById(id)
        .then(user => {
            next(null, user)
        })
        .catch(err => next(err))
})

// --- SET STRATEGY ----
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},(req, username,password, next) => {
    User.findOne({ email: username })
        .populate(['friends', 'doubts'])
        .then(user => {
            if(user){
                bcrypt.compare(password, user.password)
                    .then(response => {
                        if(!response){
                            next(null, false, {message: 'Email o contraseña incorrectos'})
                        }else {
                            next(null, user)
                        }
                    })
                }else {
                    next(null, false, {message: 'Email o contraseña incorrectos'})
                }
            })
            .catch(err => {
                console.error(err)
                next(err)
            })
        
}))