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
app.use('/room', gameRouter.gameRouter);

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
    socket.on('chat_message', function(data) {
        io.sockets.emit('chat_message', data);
    });
    setInterval(() => {
        socket.emit('number', parseInt(Math.random() * 10));
    }, 1000);


    /**
     *  users and rooms management
     *  @Author: Qiaoli wang (wangqiao@deakin.edu.au)
     */

    let roomList = listRooms();
    let currentRoom;
    let err = {};

    setInterval(() => {
        socket.emit('listRooms', roomList);
    }, 1000);

    setInterval(() => {
        socket.emit('currentRoom', currentRoom);
    }, 1000);

    socket.on('newUser', (name) => {

        const user = addUser({ id: socket.id, name, isInRoom: false, isBot: false });
        socket.emit('currentUser', user);

    })
    socket.on('addBot', (roomId) => {
        let botId = Math.random() * 1000;
        const bot = addUser({ id: `Bot${botId}`, name: 'Bot', isInRoom: false, isBot: true });
        joinRoom(roomId, bot);
    })

    socket.on('createRoom', () => {
        const roomOwner = getUser(socket.id);

        if (!roomOwner.isInRoom) {

            const room = createRoom(socket.id, roomOwner);
            currentRoom = room.room;

            socket.emit('currentRoom', currentRoom);

        } else {
            err = { code: 1, content: 'Existing roomUser' };
            socket.emit('errNotice', err);
        }
    })
    joinRoom = (roomId, bot) => {

        const curRoom = getRoom(roomId);

        let user = bot ? bot.user : getUser(socket.id);
        let existingRoomUser;

        if (user.isBot) {
            existingRoomUser = false;
        } else {
            existingRoomUser = curRoom.roomUsers.find((user) => user.id === socket.id);
        }

        if (!existingRoomUser && !user.isInRoom) {

            user.isInRoom = true;
            curRoom.roomUsers.push(user);
            currentRoom = curRoom;

            socket.emit('currentRoom', currentRoom);

        } else {
            err = { code: 1, content: 'Existing roomUser' };
            socket.emit('errNotice', err);
        }
    }
    socket.on('joinRoom', (roomId) => {
        joinRoom(roomId);
    })
    socket.on('matchRoom', () => {

        let user = getUser(socket.id);
        roomList.forEach((room) => {
            if (room.roomUsers.length < 7) {
                if (!user.isInRoom) {
                    joinRoom(room.id);
                }
            }
        })
    })

    socket.on('leaveRoom', (roomId) => {

        let room = getRoom(roomId);
        let users = room.roomUsers;

        let userIndex = users.findIndex((user) => user.id === socket.id);

        if (userIndex !== -1) {
            if (users.length == 1) {
                removeRoom(roomId);
            }
            users[userIndex].isInRoom = false;
            currentRoom = null;

            socket.emit('currentRoom', currentRoom);

            return users.splice(userIndex, 1)[0];
        }
    })

    socket.on('startGame', (roomId) => {

            let room = getRoom(roomId);
            currentRoom = room;
            socket.emit('currentRoom', currentRoom);
        })
        /** -----------------------------------------**/
});

/**
 * Database connection
 * @author Eric Kao <eric.kao5858@gmail.com>
 */
const mongoose = require('mongoose')
const uri = "mongodb+srv://user:pass@sit725.facdb.mongodb.net/<dbname>?retryWrites=true&w=majority";
const options = {
    user: 'sit725',
    pass: 'sit725',
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(uri, options, () => {
    console.log('Connected to MongoDB')
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// liston to the port 3000
http.listen(PORT, function() {
    console.log(`web server running at: http://localhost:${PORT}`)
})