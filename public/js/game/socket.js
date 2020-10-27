/**
 * @author Zilin Guo
 */

// connect to the socket
let socket = io();


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
            $.get('/cards', (data) => {
                socket.emit('initGame', [roomUsers, data, true, roomId])
            })
        } else
            socket.emit('initGame', [roomUsers, [], false, roomId])
    }
})

let players = [],
    drawpile = [],
    discardPile = []
let isUIInitialized = false,
    me, isMyTurn = false,
    isWin = false,
    isLose = false

const TIMES_DRAW_ON_TURN_START = 2

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

socket.on('startTurn', (playerID) => {
    if (me.id == playerID) {
        socket.emit("start_timer", roomId)
        socket.emit('drawCards', [me.id, TIMES_DRAW_ON_TURN_START])
        isMyTurn = true
        isPlayedBang = false
        updateTips(TIPS_MYTURN)
        return
    }
    // Game owner
    if (roomId == currentUserId) {
        for (let i = 0; i < players.length; i++) {
            // Find player
            if (players[i].id == playerID) {
                //Game owner takes controlling of bot player
                if (players[i].isBot) {
                    socket.emit('drawCards', [players[i].id, TIMES_DRAW_ON_TURN_START])
                    endTurn(players[i].id)
                    return
                }
            }
        }
    }
})

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 * Send socket message for end turn
 * @param {string} playerID ID of current player 
 */
const endTurn = (playerID) => {
    socket.emit('endTurn', playerID)
}

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 * Send socket message for adding equipment
 * @param {object} data [ID of target player, ID of used card]
 */
const playEquipment = (data) => {
    socket.emit('playEquipment', data)
}

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 * Send socket message for discard a card
 * @param {object} data [ID of target player, ID of card be discarded]
 */
const discardCard = (data) => {
    socket.emit('discardCard', data)
}

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 * Send socket message for attack another player
 * @param {object} data [ID of player initiate attack, ID of target player, ID of card be discarded]
 */
const playBang = (data) => {
    socket.emit('playBang', data)
    isInWaitingResponsePhase = true
    isPlayedBang = true
}

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 * Send socket message for draw two cards
 * @param {object} data [ID of target player, ID of used card]
 */
const playStagecoach = (data) => {
    let playerID = data[0],
        cardID = data[1]
    socket.emit('drawCards', [playerID, 2])
    socket.emit('discardCard', [playerID, cardID])
}

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 * Send socket message for every alive playerdraw a card
 * @param {object} data [ID of origin player, ID of used card]
 */
const playGeneralStore = (data) => {
    socket.emit('playGeneralStore', data)
}

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 * Send socket message for reply attack
 * @param {boolean} isCardRepelled whether a missed! is discarded 
 */
const endResponse = (isCardRepelled) => {
    socket.emit('endResponse', [responsePlayerID, me.id, isCardRepelled])
    responsePlayerID = ''
}

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 * Send socket message for regain a bullet
 * @param {object} data [ID of origin player, ID of used card]
 */
const playBeer = (data) => {
    socket.emit('playBeer', data)
}

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 * Send socket message for every alive player regain a bullet
 * @param {object} data [ID of origin player, ID of used card]
 */
const playSaloon = (data) => {
    socket.emit('playSaloon', data)
}

socket.on('endResponse', (data) => {
    let originPlayerID = data[0]
    if (originPlayerID == me.id) {
        isInWaitingResponsePhase = false
    }
})

socket.on('responseBang', (data) => {
    let targetPlayerID = data[1]
    responsePlayerID = data[0]

    // Room owner
    if (roomId == currentUserId) {
        for (let i = 0; i < players.length; i++) {
            // Bot response to bang
            if (players[i].id == targetPlayerID && players[i].isBot) {
                socket.emit('endResponse', [responsePlayerID, targetPlayerID, false])
                break
            }
        }
    }

    if (targetPlayerID == me.id) {
        isInResponsePhase = true
        updateTips(TIPS_BANG)
    }
})

socket.on('roleWin', (role) => {
    // Sheriff win and role of self is deputy
    if (role == 'Sheriff' && (me.role == 'Deputy' || me.role == 'Sheriff')) {
        isWin = true
        playerWin()
        return
    }
    // Sheriff die
    if (role == me.role) {
        isWin = true
        playerWin()
        return
    }
    isLose = true
    playerLose()
})

socket.on('playerDie', (data) => {
    let targetPlayerID = data[0]
    playerDie(targetPlayerID)
})

socket.on('botTurn', (data) => {
    let bot = data[0]
    discardPile = data[1]
    updateCardCountUI(bot.id, bot.cards.length)
})

socket.on('updatePlayer', (data) => {
    let player = data[0]
    drawpile = data[1]
    discardPile = data[2]
    updateCardCountUI(player.id, player.cards.length)
    updateDrawpile()
    updateDiscardPile()
    updateBullet(player.id, player.maxBullet, player.bullets)
    for (let i = 0; i < players.length; i++) {
        if (players[i].id == player.id) {
            players[i] = player
        }
    }

    if (player.id == me.id) {
        me = player
        updateHandsUI()
    }
})

socket.on('updatePlayerEquipment', (data) => {
    let player = data[0],
        card = data[1]
    addEquipment(player.id, card)
})

/**
 * for room chat
 * @author Zilin Guo
 */
socket.emit("join_room", roomId);
socket.emit("start_timer", roomId);
socket.on('chat_message', (msg) => {
    var color = "black";
    if (msg.isPublicMessage) {
        color = "red";
    }
    $("#messageTextarea").html($("#messageTextarea").html() + "<span style='color: " + color + "'>" + msg.content + "</span><br>");
    var height = $("#messageTextarea")[0].scrollHeight;
    $("#messageTextarea").scrollTop(height);
})
socket.on('player_timer', (timer) => {
    $("#timer").text(timer);
})
const sendMessage = () => {
    var message = $("#message").val();
    let msg = {
        isPublicMessage: false,
        content: me.name + " : " + message
    }
    socket.emit("chat_message", msg);
}

setInterval(() => {
    updateRoles();
}, 1000);

$(() => {
    $('#sendMessageButton').click(sendMessage);
})

function updateRoles() {
    var rolesHtml = "";
    players.forEach(p => {
        if (!p.isDead) {
            rolesHtml += "<img class='valign' src='assets/game/roles/" + p.role.toLowerCase() + ".png' height='100%'>";
        }
    })
    $("#roles").html(rolesHtml);
}

function updateDiscardPile() {
    if (discardPile.length != 0)
        $("#discardpile").html("<img src='" + discardPile[discardPile.length - 1].image + "' height='100%'>");
}