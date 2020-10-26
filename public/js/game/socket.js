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

socket.on('startTurn', (playerID) => {
    if (me.id == playerID) {
        socket.emit('drawCards', me.id)
        isMyTurn = true
        updateTips(TIPS_MYTURN)
        return
    }
    // Game owner
    if (roomId == currentUserId) {
        for (let i = 0; i < players.length; i++) {
            // Find player
            if (players[i].id == playerID) {
                if (players[i].isBot) {
                    socket.emit('drawCards', players[i].id)
                    endTurn(players[i].id)
                    return
                }
            }
        }
    }
})

const endTurn = (playerID) => {
    socket.emit('endTurn', playerID)
}

const playCardTo = (data) => {
    socket.emit('playCardTo', data)
}

const playerEquipmentCard = (data) => {
    socket.emit('playEquipmentCard', data)
}

const discardCard = (data) => {
    socket.emit('discardCard', data)
}

socket.on('updatePlayerCards', (data) => {
    let player = data[0]
    drawpile = data[1]
    updateCardCountUI(player.id, player.cards.length)
    updateDrawpile()
    if (player.id == me.id) {
        me.cards = player.cards
        updateHandsUI()
    }
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
            }
            break
        case 'add equipment':
            let playerID = data[1],
                card = data[2]
            addEquipment(playerID, card)
            break
    }
})

/**
 * for room chat
 * @author Zilin Guo
 */
socket.emit("join_room", roomId);
socket.emit("start_timer", roomId);
socket.on('chat_message', (msg) => {
    var color="black";
    if(msg.isPublicMessage)
    {
        color="red";
    }
    $("#messageTextarea").html($("#messageTextarea").html() +"<span style='color: "+color+"'>"+ msg.content+ "</span><br>");
    var height = $("#messageTextarea")[0].scrollHeight;
    $("#messageTextarea").scrollTop(height);
})
socket.on('player_timer', (timer) => {
    $("#timer").text(timer);
})
const sendMessage = () => {
    var message = $("#message").val();
    let msg={
        isPublicMessage:false,
        content:me.name+" : "+message
    }
    socket.emit("chat_message", msg);
}

setInterval(() => {
    updateRoles();
}, 1000);
$(() => {
    $('#sendMessageButton').click(sendMessage);
})
function updateRoles()
{
    var rolesHtml="";
    players.forEach(p=>{
        if(!p.isDead)
        {
            rolesHtml+="<img class='valign' src='assets/game/roles/" + p.role.toLowerCase() + ".png' height='100%'>";
        }
    })
    $("#roles").html(rolesHtml);
}
function updateDiscardPile()
{
    $("#discardpile").html("<img src='"+discardPile[discardPile.length-1].image+"' height='100%'>");
}


