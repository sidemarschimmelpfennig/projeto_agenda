const route = require('express').Router()
const {login , register, renderRegister, renderLogin, logout} = require('../controllers/loginController')

//rotas login
route.get('/', renderLogin)
route.post('/', login)

//rotas de cadastro
route.get('/register', renderRegister)
route.post('/register', register)

route.get('/logout', logout)

module.exports = route