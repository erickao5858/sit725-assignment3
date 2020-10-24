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
    currentUserId = idArr[2],
    currentUser
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
        currentUser = roomUsers.find(({ id }) => id === currentUserId)
        if (roomId == currentUserId) {
            isMaster = true
            initializeGame()
        }
    }
})

/**
 * @author Eric Kao <eric.kao5858@gmail.com>
 */
let players
let isMaster = false
const initializeGame = () => {
    if (!isMaster) return
    let player
    for (let i = 0; i < roomUsers.length; i++) {
        console.log(roomUsers[i])
    }
}