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
    socket.emit("chat_message", message);
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
    }
    if (!isInitialized) {
        isInitialized = true
        roomUsers = room.roomUsers;
        if (roomId == currentUserId) {
            isMaster = true
            initializeGame()
        }
    }
})

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 */
let players = []
let isMaster = false,
    isDataInitialized = false,
    me

const preparePlayerData = () => {
    for (let i = 0; i < roomUsers.length; i++) {
        let player = {}
        player.id = roomUsers[i].id
        player.name = roomUsers[i].name
        player.isBot = roomUsers[i].isBot
        player.isDead = false
        players.push(player)
    }

    // Shuffle players
    players.sort(function() { return Math.random() - 0.5; })

    for (let i = 0; i < players.length; i++) {
        players[i].role = ROLE_PRESET[players.length - 4][i]
        let character = CHARACTER_PRESET[Math.floor(Math.random() * CHARACTER_PRESET.length)]
        players[i].character = character[0]
        players[i].ability = character[1]
        players[i].maxBullet = character[2]
        players[i].cardCount = 2
        players[i].cards = []
        if (players[i].role == 'Sheriff') players[i].maxBullet += 1
    }
}

const initializeGame = () => {
    if (!isMaster) return
    $.get('/readCards', (data) => {
        preparePlayerData()
        setTimeout(() => {
            socket.emit('initGame', players)
            socket.emit('recordGameData', players, data)
        }, 0)
    })
}

socket.on('initGame', (data) => {
    if (!isDataInitialized) {
        isDataInitialized = true
        players = data
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == currentUserId) {
                me = players[i]
            }
        }
        appendUI()
    }
})

socket.on('updateHandCard', (playersWithCards, cards) => {
    updataCardCountUI(playersWithCards)
    updateDrawpile(cards.length)
    for (let i = 0; i < playersWithCards.length; i++) {
        if (playersWithCards[i].id == me.id) {
            me.cards = playersWithCards[i].cards
            break
        }
    }
    updateHandsUI()
})