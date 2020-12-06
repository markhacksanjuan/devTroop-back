require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const session = require('express-session')
const path = require('path')
const chalk = require('chalk')
const passport = require('passport')
const flash = require('connect-flash')
const cors = require('cors')

// ----- DATABASE CONFIGURATION -----
require('./configs/db.config')

// ---------------------- EXPRESS ------------
const app = express()

// ------------------ PORT ---------------------
const PORT = process.env.PORT || 3000

// --------------- MIDDLEWARE SETUP ----
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())

// --- CORS MIDDLEWARE ---
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000', '192.168.1.59:3000']
}))

// ------------ SESSION CONFIGURATION ---
app.use(session ({
    secret: `${process.env.DATABASE}`,
    resave: true,
    saveUninitialized: true
}))

// ----- PASSPORT CONFIGURATION ---
require('./configs/passport.config')

// ----------- MIDDLEWARE PASSPORT ---
app.use(passport.initialize())
app.use(passport.session())

// ---- ROUTES ---
const index = require('./routes/index.routes')
app.use('/', index)
const auth = require('./routes/auth.routes')
app.use('/auth', auth)


// ----- ERROR ROUTES ----
app.use((req, res, next) => {
    res.status(404)
    res.send('not-found')
})
app.use((err, req, res, next) => {
    if(!res.headersSent) {
        res.status(500)
        res.send('error')
    }
})

// --- LISTEN ---
app.listen(PORT, () => {
    console.log(chalk.blue.inverse.bold('conectado'))
})