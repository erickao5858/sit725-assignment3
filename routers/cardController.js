//Adding route using card controller
//@Author: Jasdeep kaur (kaurjasdee@deakin.edu.au)
const express = require('express')
var router = express.Router()

const {cardController} =require("../controllers/cardController")

router.get('/cardController',cardController)

module.exports = router;
