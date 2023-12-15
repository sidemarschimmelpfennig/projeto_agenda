const route = require('express').Router()
const { index } = require("../controllers/homeController");
const {login , register} = require('../controllers/loginController')

route.get('/', index)


route.get('/login/', login)
route.post('/login/register', register)
route.post('/login/login', register)

module.exports = route