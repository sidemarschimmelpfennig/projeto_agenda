const route = require('express').Router()


const { index } = require("../controllers/homeController");

route.get('', index)



module.exports = route