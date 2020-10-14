const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const mongo = require('./services/MongoService')
const PORT = 3000;

let http = require('http').createServer(app);
let io = require('socket.io')(http);

const { addUser, removeUser, getUser, listUsers } = require('./controllers/userController');
const { createRoom, removeRoom, getRoom, listRooms } = require('./controllers/roomController');

// for hosting static files (html)
app.use(express.static(__dirname + '/public'));

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
http.listen(PORT,function () {
    console.log(`web server running at: http://localhost:${PORT}`)
})