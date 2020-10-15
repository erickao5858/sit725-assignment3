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
     *  users and rooms management
     *  @Author: Qiaoli wang (wangqiao@deakin.edu.au)
     */
    let roomList = listRooms();
    let err ={};

    setInterval(()=>{
        socket.emit('listRooms', roomList);
    }, 1000);

    socket.on('newUser', (name) => {

        const user = addUser({ id: socket.id,name,isInRoom:false});

        socket.emit('currentUser',user);

    })

    socket.on('createRoom',() =>{
        const roomOwner = getUser(socket.id);
        if (!roomOwner.isInRoom) {
            const room = createRoom(socket.id,roomOwner);
        }else {
            err = {code:1,content:'Existing roomUser'};
            socket.emit('errNotice',err);
        }
    })
    joinRoom =(roomId)=>{

        const currentRoom = getRoom(roomId);
        const user = getUser(socket.id);

        let existingRoomUser = currentRoom.roomUsers.find((user) => user.id === socket.id);

        if(!existingRoomUser && !user.isInRoom){

            user.isInRoom = true;
            currentRoom.roomUsers.push(user);

        }else {
            err = {code:1,content:'Existing roomUser'};
            socket.emit('errNotice',err);
        }
    }
    socket.on('joinRoom',(roomId)=>{
        joinRoom(roomId);
    })
    socket.on('matchRoom',()=>{

        let user = getUser(socket.id);
        roomList.forEach((room)=>{
            if(room.roomUsers.length <7){
                if (!user.isInRoom){
                    joinRoom(room.id);
                }
            }
        })
    })
});

// setup the DB
mongo.startDB()

// liston to the port 3000
http.listen(PORT,function () {
    console.log(`web server running at: http://localhost:${PORT}`)
})