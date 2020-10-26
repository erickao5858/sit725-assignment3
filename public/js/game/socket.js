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
                socket.emit('initGame', [roomUsers, data, true, roomId])
            })
        } else
            socket.emit('initGame', [roomUsers, [], false, roomId])
    }
})

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 */
let players = [],
    drawpile = [],
    discardPile = []
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
            } else
                players[i].cards = []
        }
        initUI()
    }
})


const TIMES_DRAW_ON_TURN_START = 2

socket.on('startTurn', (playerID) => {
    if (me.id == playerID) {
        socket.emit('drawCards', [me.id, TIMES_DRAW_ON_TURN_START])
        isMyTurn = true
        updateTips(TIPS_MYTURN)
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

const playCardTo = (data) => {
    socket.emit('playCardTo', data)
}

const playerEquipmentCard = (data) => {
    socket.emit('playEquipmentCard', data)
}

socket.on('updatePlayerCards', (data) => {
    let player = data
    if (player.id == me.id) {
        me.cards = player.cards
        updateHandsUI()
    }
    updateCardCountUI(player.id, player.cards.length)
})

socket.on('updatePlayerInfo', (data) => {
    let mode = data[0]
    switch (mode) {
        case 'lose bullet':
            let fromPlayerID = data[1],
                toPlayerID = data[2]
            discardPile = data[3]
            let targetPlayer = players.find((player) => player.id == toPlayerID)
            targetPlayer.bullets -= 1
            lostBullet(targetPlayer.id)
            if (targetPlayer.bullets == 0) {
                targetPlayer.isDead = true
                if (toPlayerID == me.id) {
                    emptyHandsUI()
                    updateTips(TIPS_DEAD)
                }
                playerDie(targetPlayer)
                if (fromPlayerID == me.id)
                    socket.emit('drawCards', [me.id, TIMES_DRAW_ON_TURN_START])
            }
            break
        case 'add equipment':
            let playerID = data[1],
                card = data[2]
            addEquipment(playerID, card)
            break
    }
})