//Adding route using card controller
//@Author: Jasdeep kaur (kaurjasdee@deakin.edu.au)
const express = require('express')
var router = express.Router()

const {characters} =require("../controllers/characters")

router.get('/characters',characters)

module.exports = router;