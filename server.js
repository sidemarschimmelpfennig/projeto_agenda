require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const helmet = require('helmet')
const csrf = require('csurf')
const {globalMiddleware, checkCsrfError, csrfMiddleware} = require('./src/middleware/index')
mongoose.connect(process.env.CONNECT ).then(()=>{
    app.emit('pronto')
})
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
const path = require('path')
const routes = require('./src/routes')

app.use(helmet()) // começou a  causar problemas inicialmente nas rotas
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.resolve(__dirname, 'public')))

const sessionOptions = session({
    secret:'teste123',
    store: MongoStore.create({
        mongoUrl : process.env.CONNECT
    }),
    resave : false,
    saveUninitialized : false,
    cookie : {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})

app.use(sessionOptions)
app.use(flash())
app.set('views', path.resolve(__dirname, 'src', 'views'))
app.set('view engine', 'ejs')

app.use(csrf())

app.use(globalMiddleware)
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(routes)


app.on('pronto',()=>{
    app.listen(process.env.PORT, ()=>{
        console.log(`rodando na porta http://localhost:${process.env.PORT}/`)
    })
})

