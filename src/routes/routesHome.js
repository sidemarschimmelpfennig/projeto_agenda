const route = require('express').Router()
const {loginRequired } = require('../middleware')

const { index } = require("../controllers/homeController");

route.get('',loginRequired, index)



module.exports = route