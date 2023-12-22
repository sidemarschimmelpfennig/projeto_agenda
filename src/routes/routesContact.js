const route = require('express').Router()
const { indexContact, registerContact, editContact, editContactSave, deleteContact } = require("../controllers/contactController");
const {loginRequired } = require('../middleware')

route.get('/',loginRequired, indexContact)
route.get('/:id', loginRequired, editContact)
route.post('/register', loginRequired, registerContact);
route.post('/edit/:id', loginRequired, editContactSave)
route.get('/delete/:id', loginRequired, deleteContact )

module.exports = route