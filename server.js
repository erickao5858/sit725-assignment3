const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const PORT = 3000;

const gameRouter = require('./routers/gameRouter');

let http = require('http').createServer(app);
let io = require('socket.io')(http);

const { addUser, removeUser, getUser, listUsers } = require('./controllers/userController');
const { createRoom, removeRoom, getRoom, listRooms } = require('./controllers/roomController');

// for hosting static files (html)
app.use(express.static(__dirname + '/public'));

// setup the routes
app.use('/room',gameRouter.gameRouter);

// need to add the body parser so that we can extract the body data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//socket connection
io.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('a user disconnected');
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
    let currentRoom;
    let userList = listUsers();
    let currentUser;
    let err ={};

    setInterval(()=>{
        socket.emit('listRooms', roomList);
    }, 1000);

    setInterval(()=>{
        socket.emit('listUsers', userList);
    }, 1000);

    setInterval(()=>{
        socket.emit('currentRoom',currentRoom);
    }, 1000);


    socket.on('newUser', (name) => {

        currentUser = null;
        const user = addUser({ id: socket.id,name,isInRoom:false,isBot:false});
        currentUser = user;
        socket.emit('currentUser',currentUser);

    })
    socket.on('addBot',(roomId)=>{
        let botId = Math.floor(Math.random() * 1000);
        const bot = addUser({id:`Bot${botId}`,name:'Bot',isInRoom:false,isBot:true});
        joinRoom({roomId,bot,curUser:false});
    })

    socket.on('createRoom',() =>{

        let roomOwner = getUser(socket.id);

        if (!roomOwner.isInRoom) {

            let room = createRoom(socket.id,roomOwner);
            currentRoom = room.room;
            roomOwner.isInRoom = true;
            currentUser = roomOwner;

        }else {
            err = {code:1,content:'Existing roomUser'};
            socket.emit('errNotice',err);
        }
    })

    joinRoom =({roomId,bot,curUser})=>{

        const curRoom = getRoom(roomId);

        let user = bot ? bot.user : curUser.user ? curUser.user: curUser;
        let existingRoomUser;

        if (user.isBot){
            existingRoomUser = false;
        } else {
            existingRoomUser = curRoom.roomUsers.find((item) => item.id == user.id);
        }

        if(!existingRoomUser && !user.isInRoom){

            user.isInRoom = true;
            curRoom.roomUsers.push(user);

            currentRoom = curRoom;

        }else {
            err = {code:1,content:'Existing roomUser'};
            socket.emit('errNotice',err);
        }
    }

    socket.on('joinRoom',(data)=>{
        joinRoom(data);
    })
    socket.on('matchRoom',(curUser)=>{

        let user = curUser.user ?curUser.user :curUser;

        if (roomList.length == 1 && roomList[0].gameStarted){
            err = {code:2,content:'Room is full'};
            socket.emit('errNotice',err);
        }

        roomList.forEach((room)=>{
            if(room.roomUsers.length <7 && !room.gameStarted){
                if (user.isInRoom == false){
                    joinRoom({roomId:room.id,bot:false,curUser:user});
                }
            }
        })
    })

    leaveRoom =(roomId,curUser)=>{

        try {
            if (roomId){

                let room = getRoom(roomId);
                let users = room.roomUsers;
                let user = curUser.user ? curUser.user :curUser;
                let userId = null;
                let bots = 0;

                userId = user.id;

                console.log(socket.id,userId,'LeaveUserId');

                // remove current user in this room
                let userIndex = users.findIndex((item) => item.id === userId);

                user.isInRoom = false;

                currentUser = user;

                users.splice(userIndex,1);

                // if current user is room owner
                if (userId == roomId){
                    // remove all the bots in this room
                    users.forEach((user)=>{
                        if(user.isBot){
                            bots++;
                        }
                    })
                    users.splice(0,bots);

                    // remove current room
                    removeRoom(roomList,roomId);

                    if (users.length > 0){
                        room.id = users[0].id;
                        // create the new room for new owner
                        let newRoom = createRoom(room.id,users[0]);

                        currentRoom = newRoom.room;
                    }

                }else {
                    currentRoom = [];
                }
            }
        }catch (e) {
           console.log(e);
        }
    }

    socket.on('leaveRoom',(roomId,user)=>{

        leaveRoom(roomId,user);

    })

    socket.on('startGame',(roomId)=>{
        let room = getRoom(roomId);
        if (room){
            room.gameStarted = true;
        }
        currentRoom = room;
        socket.emit('currentRoom',currentRoom);
    })
    /** -----------------------------------------**/
});



// liston to the port 3000
http.listen(PORT,function (err) {
    if (err) console.log(err); 
    console.log(`web server running at: http://localhost:${PORT}`)
})