const Express = require('express')
const path = require('path');
let router = Express.Router()


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'../controllers/cardController'));
})

module.exports = {
    gameRouter:router
}