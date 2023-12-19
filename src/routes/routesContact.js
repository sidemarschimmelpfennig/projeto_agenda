const route = require('express').Router()
const { indexContact, register } = require("../controllers/contactController");
const {loginRequired } = require('../middleware')

route.get('/', indexContact)
route.post('/register', loginRequired, register);

module.exports = route