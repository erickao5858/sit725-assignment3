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

    //console.log('a user connected');

    socket.on('disconnect', () => {
        //console.log('a user disconnected');
    });

    //function for game chat
    //author:zilin
    //function for lobby chat
    //author:sibbi
    socket.on('chat_message', function(data) {
        io.sockets.emit('chat_message', data); //author:sibbi changed data.message to data inorder to receive user name.
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
        let botId = Math.floor(Math.random() * 1000);
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

        if (roomList.length == 1 && roomList[0].gameStarted) {
            err = { code: 2, content: 'Room is full' };
            socket.emit('errNotice', err);
        }

        roomList.forEach((room) => {
            if (room.roomUsers.length < 7 && !room.gameStarted) {
                if (!user.isInRoom) {
                    joinRoom(room.id);
                }
            }
        })
    })

    leaveRoom = (roomId) => {
        let room = getRoom(roomId);
        let users = room.roomUsers;
        let bots = 0;

        // remove current user in this room
        let userIndex = users.findIndex((user) => user.id === socket.id);

        users[userIndex].isInRoom = false;

        users.splice(userIndex, 1);

        if (socket.id == roomId) {
            // remove all the bots in this room
            users.forEach((user) => {
                if (user.isBot) {
                    bots++;
                }
            })
            users.splice(0, bots);
        }

        // if no user here, remove current room
        if (users.length == 0) {
            removeRoom(roomList, roomId);

        } else {
            // if users here ,the fist user would be the room owner.
            room.id = users[0].id;
        }
        currentRoom = null;

        socket.emit('currentRoom', currentRoom);
    }

    socket.on('leaveRoom', (roomId) => {

        leaveRoom(roomId);
    })

    socket.on('startGame', (roomId) => {
            let room = getRoom(roomId);
            if (room) {
                room.gameStarted = true;
            }
            currentRoom = room;
            socket.emit('lobbyStart', roomId)
            socket.emit('currentRoom', currentRoom);
        })
        /** -----------------------------------------**/

    /**
     * @author Eric Kao 
     * 
     */

    let GameControl = require('./gameControl')

    socket.on('initGame', (data) => {
        io.sockets.emit('initGame', data);
    })

    socket.on('recordGameData', (players, cards) => {
        let gameControl = new GameControl(players, cards)
        gameControl.initDraw()
        socket.emit('updateHandCard', gameControl.players, gameControl.drawpile)
        socket.emit('')
    })
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
    useUnifiedTopology: true,
    dbName: 'Bang'
}
mongoose.connect(uri, options, () => {
    console.log('Connected to MongoDB')
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const Test = require('./controllers/test')(mongoose)
app.get('/readCards', (req, res) => {
    Test.read(res)
})

// liston to the port 3000
http.listen(PORT, function() {
    console.log(`web server running at: http://localhost:${PORT}`)
})