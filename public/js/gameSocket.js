/**
 * get room users
 * author: Qiaoli Wang wangqiao@deakin.edu.au
 * @type {string}
 */

// connect to the socket

/*
let socket = io();

socket.on('chat_message', (msg) => {
    $("#messageTextarea").text($("#messageTextarea").val() + "\n" + msg);
    var height = $("#messageTextarea")[0].scrollHeight;
    $("#messageTextarea").scrollTop(height);
})

const sendMessage = () => {
    var message = $("#message").val();
    socket.emit("chat_message", message);
}

let idUrl = window.location.search,
    idArr = idUrl.split('='),
    roomId = idArr[1],
    roomUsers

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
*/