const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const app = express()
const mongo = require('./services/MongoService')
const PORT = 7070;

let http = require('http').createServer(app);
let io = require('socket.io')(http);


// for hosting static files (html)
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html'); 
app.all('/rules',function(req,res){
    res.sendFile(path.join(__dirname+'/public/rules.html'));
    // return res.redirect('/index');
});

app.all('/lobby',function(req,res){
    res.sendFile(path.join(__dirname+'/public/lobby.html'));
    // return res.redirect('/index');
});





// need to add the body parser so that we can extract the body data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//socket connection
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    //function for game chat
    //author:zilin
    socket.on('chat_message', function (data) {
        io.sockets.emit('chat_message', data);
        });
    setInterval(()=>{
        socket.emit('number', parseInt(Math.random()*10));
    }, 1000);


    /**
     *  users and rooms connected
     *  @Author: Qiaoli wang (wangqiao@deakin.edu.au)
     */

    let roomList = listRooms();

    setInterval(()=>{
        socket.emit('listRooms', roomList);
    }, 1000);


    socket.on('newUser', (name) => {

        const user = addUser({ id: socket.id,name});

        socket.emit('currentUser',user);


        console.log(user);

    })

    socket.on('createRoom',() =>{

        const roomOwner = getUser(socket.id);
        const room = createRoom(socket.id,roomOwner);
    })

});

// setup the DB
mongo.startDB()

// liston to the port 3000
http.listen(PORT,function (err) {
    if (err) console.log(err); 
    console.log(`web server running at: http://localhost:${PORT}`)
})