const user = require('../models/user.model')

const checkForAuthentication = (req, res, next) => {
    if(req.isAuthenticated()) {
        if(req.user.isVerified){
            return next()
        }else { res.redirect ('/') }
    }
}


module.exports = { checkForAuthentication }