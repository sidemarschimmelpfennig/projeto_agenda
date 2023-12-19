const route = require('express').Router()
const routesHome = require('./routesHome')
const routesLogin = require('./routesLogin')
const routesContact = require('./routesContact')


//rotas principais fazendo suas ramificaçoes
route.use('/',routesHome)
route.use('/login', routesLogin)
route.use('/contact', routesContact)

module.exports = route