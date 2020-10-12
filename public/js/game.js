// connect to the socket
let socket = io();

//
socket.on('chat_message', (msg) => {
    $("#messageTextarea").text($("#messageTextarea").val()+"\n"+msg);
    var height=$("#messageTextarea")[0].scrollHeight;
    $("#messageTextarea").scrollTop(height);
})

const sendMessage=()=>{
    var message=$("#message").val();
    socket.emit("chat_message",message);
  }
$(document).ready(function(){ 
    　　$("#players").html("<img src=\"assets/test.jpg\" class=\"playerImage\"><img src=\"assets/test.jpg\" class=\"playerImage\">");
    //bind the button
    $('#sendMessageButton').click(sendMessage);
    
});   