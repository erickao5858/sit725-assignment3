/**
 * @author Zilin Guo
 */

// connect to the socket
let socket = io();

//
socket.on('chat_message', (msg) => {
    $("#messageTextarea").text($("#messageTextarea").val() + "\n" + msg);
    var height = $("#messageTextarea")[0].scrollHeight;
    $("#messageTextarea").scrollTop(height);
})

const sendMessage = () => {
    var message = $("#message").val();
    socket.emit("chat_message", me.name + ": " + message);
}

$(() => {
    $('#sendMessageButton').click(sendMessage);
})

/**
 * get room users
 * author: Qiaoli Wang wangqiao@deakin.edu.au
 * @type {string}
 */
let idUrl = window.location.search,
    idArr = idUrl.split('=');
let roomId = idArr[1].split('&')[0],
    currentUserId = idArr[2]
let roomUsers;

let isInitialized = false

if (roomId) {
    socket.emit('startGame', roomId);
}
socket.on('currentRoom', (room) => {
    if (!room) {
        socket.emit('startGame', roomId);
        return
    }
    if (!isInitialized) {
        isInitialized = true
        roomUsers = room.roomUsers;
        if (roomId == currentUserId) {
            $.get('/readCards', (data) => {
                socket.emit('initGame', [roomUsers, data])
            })
        }
    }
})

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 */
let players = [],
    drawpile = []
let isUIInitialized = false,
    me, isMyTurn = false


socket.on('initGame', (data) => {
    if (!isUIInitialized) {
        isUIInitialized = true
        players = data[0]
        drawpile = data[1]
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == currentUserId) {
                me = players[i]
            }
        }
        initUI()
    }
})

/*
socket.on('startTurn', (data) => {
    let player = data[0]
    drawpile = data[1]
    updateCardCountUI(player.id, player.cards.length)
    updateDrawpile()
    if (me.id == player.id) {
        me.cards = player.cards
        updateHandsUI()
        isMyTurn = true
    }
})
*/

const TIMES_DRAW_ON_TURN_START = 2

socket.on('startTurn', (data) => {
    let player = data[0]
    if (me.id == player.id) {
        socket.emit('drawCards', [me.id, TIMES_DRAW_ON_TURN_START])
        isMyTurn = true
    }
})
socket.on('drawCards', (data) => {
    let player = data[0]
    drawpile = data[1]
    updateCardCountUI(player.id, player.cards.length)
    updateDrawpile()
    if (me.id == player.id) {
        me.cards = player.cards
        updateHandsUI()
    }
})