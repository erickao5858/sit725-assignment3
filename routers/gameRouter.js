/**
 *  @Author: Qiaoli wang (wangqiao@deakin.edu.au)
 **/
const Express = require('express')
const path = require('path');
let router = Express.Router()


router.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'../../public/game.html'));
})

module.exports = {
    gameRouter:router
}