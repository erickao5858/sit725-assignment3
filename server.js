const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const PORT = 3000;

const gameRouter = require('./routers/gameRouter');

let http = require('http').createServer(app);
let io = require('socket.io')(http);

const { addUser, removeUser, getUser, listUsers } = require('./controllers/userController');
const { createRoom, removeRoom, getRoom, listRooms } = require('./controllers/roomController');
const cardData = require('./controllers/cardController');
const characterData = require('./controllers/characters');

// for hosting static files (html)
app.use(express.static(__dirname + '/public'));

//setup the controller
//@Author: Jasdeep kaur (kaurjasdee@deakin.edu.au)
const cardController = require("./routers/cardRouter")
app.use('/', cardController);

//setup the controller
//@Author: Jasdeep kaur (kaurjasdee@deakin.edu.au)
const characters = require("./routers/characters")
app.use('/', characters);


/**
 *  get the card data
 *  @Author: Qiaoli wang (wangqiao@deakin.edu.au)
 */

app.get('/cards', (req, res) => {
    cardData.cardController(req, res);
})
app.get('/characters', (req, res) => {
    characterData.characters(req, res);
})


// setup the routes
app.use('/room', gameRouter.gameRouter);

// need to add the body parser so that we can extract the body data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//socket connection
io.on('connection', (socket) => {

    //console.log(socket.id);

    socket.on('disconnect', () => {
        //console.log('a user disconnected');
    });
    //function for lobby chat
    //author:sibbi
    socket.on('lobby_chat_message', function(data) {
        io.sockets.emit('lobby_chat_message', data);
    });

    /** -----------------------------------------**/

    /**
     * roomchat, player timer
     * @author Zilin Guo 
     * 
     */
    global.timer = new Object();
    socket.on('chat_message', function(message) {
        //get current room
        var room = Object.keys(socket.rooms)[1];
        io.sockets.in(room).emit('chat_message', message);
    });
    //join chat room
    socket.on('join_room', function(roomId) {
        socket.join(roomId);
    });
    socket.on('start_timer', function(roomId) {
        global.timer[roomId] = 0;
    });
    // socket.on('get_timer', function(roomId) {
    //     io.sockets.emit('timer', global.timer[roomId]);
    // });
    setInterval(() => {
        if (currentRoom)
            socket.emit('player_timer', global.timer[currentRoom.id]);
    }, 1000);

    /** -----------------------------------------**/

    /**
     *  users and rooms management
     *  @Author: Qiaoli wang (wangqiao@deakin.edu.au)
     */

    let roomList = listRooms();
    let currentRoom;
    let userList = listUsers();
    let currentUser;
    let err = {};

    setInterval(() => {
        socket.emit('listRooms', roomList);
    }, 1000);

    setInterval(() => {
        socket.emit('listUsers', userList);
    }, 1000);

    setInterval(() => {
        socket.emit('currentRoom', currentRoom);
    }, 1000);


    socket.on('newUser', (name) => {

        currentUser = null;
        const user = addUser({ id: socket.id, name, isInRoom: false, isBot: false });
        currentUser = user;
        socket.emit('currentUser', currentUser);

    })
    socket.on('addBot', (roomId) => {
        let botId = Math.floor(Math.random() * 1000);
        const bot = addUser({ id: `Bot${botId}`, name: 'Bot', isInRoom: false, isBot: true });
        joinRoom({ roomId, bot, curUser: false });
    })

    socket.on('createRoom', () => {
        let roomOwner;
        let user = currentUser.user ? currentUser.user : currentUser;
        roomOwner = user.id == socket.id ? user : getUser(socket.id);

        if (!roomOwner.isInRoom) {
            let room = createRoom(socket.id, roomOwner);
            currentRoom = room.room;
            roomOwner.isInRoom = true;
            currentUser = roomOwner;

        } else {
            err = { code: 1, content: 'Existing roomUser' };
            socket.emit('errNotice', err);
        }
    })

    joinRoom = ({ roomId, bot, curUser }) => {

        const curRoom = getRoom(roomId);

        let user = bot ? bot.user : curUser.user ? curUser.user : curUser;
        let existingRoomUser;

        if (user.isBot) {
            existingRoomUser = false;
        } else {
            existingRoomUser = curRoom.roomUsers.find((item) => item.id == user.id);
        }

        if (!existingRoomUser && !user.isInRoom) {

            user.isInRoom = true;
            curRoom.roomUsers.push(user);

            currentRoom = curRoom;

        } else {
            err = { code: 1, content: 'Existing roomUser' };
            socket.emit('errNotice', err);
        }
    }

    socket.on('joinRoom', (data) => {
        joinRoom(data);
    })
    socket.on('matchRoom', (curUser) => {

        let user = curUser.user ? curUser.user : curUser;

        if (roomList.length == 1 && roomList[0].gameStarted) {
            err = { code: 2, content: 'Room is full' };
            socket.emit('errNotice', err);
        }

        roomList.forEach((room) => {
            if (room.roomUsers.length < 7 && !room.gameStarted) {
                if (user.isInRoom == false) {
                    joinRoom({ roomId: room.id, bot: false, curUser: user });
                }
            }
        })
    })

    leaveRoom = (roomId, curUser) => {

        try {
            if (roomId) {

                let room = getRoom(roomId);
                let users = room.roomUsers;
                let user = curUser.user ? curUser.user : curUser;
                let userId = null;
                let bots = 0;

                userId = user.id;

                console.log(socket.id, userId, 'LeaveUserId');

                // remove current user in this room
                let userIndex = users.findIndex((item) => item.id === userId);

                user.isInRoom = false;

                currentUser = user;

                users.splice(userIndex, 1);

                // if current user is room owner
                if (userId == roomId) {
                    // remove all the bots in this room
                    users.forEach((user) => {
                        if (user.isBot) {
                            bots++;
                        }
                    })
                    users.splice(0, bots);

                    // remove current room
                    removeRoom(roomList, roomId);

                    if (users.length > 0) {
                        room.id = users[0].id;
                        // create the new room for new owner
                        let newRoom = createRoom(room.id, users[0]);

                        currentRoom = newRoom.room;
                    }

                } else {
                    currentRoom = [];
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    socket.on('leaveRoom', (roomId, user) => {

        leaveRoom(roomId, user);

    })

    socket.on('startGame', (roomId) => {
            let room = getRoom(roomId);
            if (room) {
                room.gameStarted = true;
            }
            currentRoom = room;
            socket.emit('currentRoom', currentRoom);
        })
        /** -----------------------------------------**/

    /**
     * @author Eric Kao 
     * 
     */

    let gameControl
    const TIMES_DRAW_ON_TURN_START = 2
    const TIMES_DRAW_ON_TARGET_DIE = 2

    // data[0]: users, data[1]: cards
    socket.on('initGame', (data) => {
        let isMaster = data[2],
            roomId = data[3]
        if (isMaster) {
            gameControl = new GameControl(data[1])
            gameControl.preparePlayerData(data[0])
            gameControls[roomId] = gameControl
            setTimeout(() => {
                io.sockets.emit('initGame', [gameControl.players, gameControl.drawPile])
                io.sockets.emit('startTurn', gameControl.players[0].id)
            }, 1000)
        } else {
            setTimeout(() => {
                gameControl = gameControls[roomId]
            }, 1000)
        }
    })

    socket.on('drawCards', (data) => {
        let playerID = data
        gameControl.draw(playerID, TIMES_DRAW_ON_TURN_START)
        io.sockets.emit('updatePlayer', [gameControl.getPlayerById(playerID), gameControl.drawPile, gameControl.discardPile])
    })

    socket.on('endResponse', (data) => {
        let originPlayerID = data[0],
            targetPlayerID = data[1],
            isCardRepelled = data[2],
            targetPlayer = gameControl.getPlayerById(targetPlayerID),
            message

        if (!isCardRepelled) {
            let isTargetDie = gameControl.loseBullet(targetPlayerID)
            if (isTargetDie) {
                io.sockets.emit('updatePlayer', [gameControl.getPlayerById(targetPlayerID), gameControl.drawPile, gameControl.discardPile])
                io.sockets.emit('playerDie', [targetPlayerID])
                gameControl.draw(originPlayerID, TIMES_DRAW_ON_TARGET_DIE)
                io.sockets.emit('updatePlayer', [gameControl.getPlayerById(originPlayerID), gameControl.drawPile, gameControl.discardPile])
                if (gameControl.winnerRole != '') {
                    io.sockets.emit('roleWin', gameControl.winnerRole)
                }
            }
            message = {
                isPublicMessage: true,
                content: targetPlayer.character + '(' + targetPlayer.name + ')' + ' losed one bullet'
            }
        } else {
            message = {
                isPublicMessage: true,
                content: targetPlayer.character + '(' + targetPlayer.name + ')' + ' repelled the attack'
            }
        }
        io.sockets.emit('chat_message', message)

        io.sockets.emit('updatePlayer', [gameControl.getPlayerById(originPlayerID), gameControl.drawPile, gameControl.discardPile])

        io.sockets.emit('updatePlayer', [gameControl.getPlayerById(targetPlayerID), gameControl.drawPile, gameControl.discardPile])

        io.sockets.emit('endResponse', [originPlayerID])
    })

    socket.on('playBang', (data) => {
        let originPlayerID = data[0],
            targetPlayerID = data[1],
            cardID = data[2]
        gameControl.discardCard(originPlayerID, cardID)

        io.sockets.emit('responseBang', [originPlayerID, targetPlayerID])

        /**
         *  send player action message to public
         *  added by qiaoli wang (wangqiao@deakin.edu.au)
         */

        let originPlayer = gameControl.getPlayerById(originPlayerID),
            targetPlayer = gameControl.getPlayerById(targetPlayerID),
            cardName = gameControl.getCardById(cardID).text

        let message = {
            isPublicMessage: true,
            content: originPlayer.character + '(' + originPlayer.name + ') played a ' + cardName + ', targeting ' + targetPlayer.character + '(' + targetPlayer.name + ')'
        }

        io.sockets.emit('chat_message', message)
        io.sockets.emit('updatePlayer', [gameControl.getPlayerById(originPlayerID), gameControl.drawPile, gameControl.discardPile])
    })

    socket.on('discardCard', (data) => {
        let playerID = data[0],
            cardID = data[1]
        gameControl.discardCard(playerID, cardID)
        io.sockets.emit('updatePlayer', [gameControl.getPlayerById(playerID), gameControl.drawPile, gameControl.discardPile])
    })

    socket.on('playEquipment', (data) => {
        let playerID = data[0],
            cardID = data[1]
        gameControl.discardCard(playerID, cardID)
        io.sockets.emit('updatePlayerEquipment', [gameControl.getPlayerById(playerID), gameControl.getCardById(cardID)])
        io.sockets.emit('updatePlayer', [gameControl.getPlayerById(playerID), gameControl.drawPile, gameControl.discardPile])
    })

    socket.on('playBeer', (data) => {
        let playerID = data[0],
            cardID = data[1]
        gameControl.regainBullet(playerID, cardID)

        let originPlayer = gameControl.getPlayerById(playerID)
        let message = {
            isPublicMessage: true,
            content: originPlayer.character + '(' + originPlayer.name + ') played a Beer and regain a bullet'
        }

        io.sockets.emit('chat_message', message)
        io.sockets.emit('updatePlayer', [gameControl.getPlayerById(playerID), gameControl.drawPile, gameControl.discardPile])
    })

    socket.on('playSaloon', (data) => {
        let playerID = data[0],
            cardID = data[1],
            alivePlayers = gameControl.getAlivePlayers()
        gameControl.saloon(playerID, cardID)
        for (let i = 0; i < alivePlayers.length; i++) {
            io.sockets.emit('updatePlayer', [alivePlayers[i], gameControl.drawPile, gameControl.discardPile])
        }

        let originPlayer = gameControl.getPlayerById(playerID)

        let message = {
            isPublicMessage: true,
            content: originPlayer.character + '(' + originPlayer.name + ') played a Saloon, everyone regain a bullet!'
        }

        io.sockets.emit('chat_message', message)
    })

    socket.on('playGeneralStore', (data) => {
        let originPlayerID = data[0],
            cardID = data[1]
        alivePlayers = gameControl.getAlivePlayers()

        gameControl.discardCard(originPlayerID, cardID)

        for (let i = 0; i < alivePlayers.length; i++) {
            gameControl.draw(alivePlayers[i].id, 1)
            io.sockets.emit('updatePlayer', [alivePlayers[i], gameControl.drawPile, gameControl.discardPile])
        }

        let originPlayer = gameControl.getPlayerById(originPlayerID)

        let message = {
            isPublicMessage: true,
            content: originPlayer.character + '(' + originPlayer.name + ') played a General Store, everyone draw a card!'
        }

        io.sockets.emit('chat_message', message)

    })

    socket.on('endTurn', (playerID) => {
        if (gameControl.getPlayerById(playerID).isBot) {
            let bot = gameControl.getPlayerById(playerID)
            if (bot.cards.length > bot.bullets) {
                gameControl.discardCard(bot.id, bot.cards.length - bot.bullets)
                for (let i = 0; i < bot.cards.length - bot.bullets; i++)
                    gameControl.discardPile.push(bot.cards.splice(0, 1)[0])
                io.sockets.emit('botTurn', [bot, gameControl.discardPile])
            }
        }
        let nextPlayerID = gameControl.getNextAlivePlayer(playerID)
        io.sockets.emit('startTurn', nextPlayerID)
    })
});


/**
 * Database connection
 * @author Eric Kao <eric.kao5858@gmail.com>
 */

const GameControl = require('./gameControl')
let gameControls = {}

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

/** -----------------------------------------**/

/**
 * roomchat, player timer
 * @author Zilin Guo 
 * 
 */
setInterval(() => {
    setTimer();
}, 1000);

function setTimer() {
    for (var k in global.timer) {
        if (global.timer.hasOwnProperty(k)) {
            if (global.timer[k] != -1) {
                global.timer[k] += 1;
            }
            if (global.timer[k] >= 40) {
                global.timer[k] = -1;
            }
        }
    }
}
// liston to the port 3000
http.listen(PORT, function() {
    console.log(`web server running at: http://localhost:${PORT}`)
})