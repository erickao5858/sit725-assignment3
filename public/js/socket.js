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
let roomId = idArr[1];
let roomUsers;

/*
if (roomId) {
    socket.emit('startGame', roomId);
}
socket.on('currentRoom', (room) => {
    if (!room) {
        socket.emit('startGame', roomId);
    }
    roomUsers = room.roomUsers;

    console.log(roomUsers, 'users');
})
* */