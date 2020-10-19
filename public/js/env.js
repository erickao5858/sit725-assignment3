const testButtonFunction=()=>{
  alert('Thank you for clicking')
}

// connect to the socket
let socket = io();

// const sendMessage=()=>{
//   let message = $('#input_text').val()
//   let payload = {
//     "msg" : message,
//     "sender" : "demo"
//   }
//   socket.emit('chat-message',payload)
// }

socket.on('number', (msg) => {
    console.log('Random number: ' + msg);
})

console.log('test')
$(document).ready(function(){
  console.log('Ready')
  

  //binding the click message button
  // $('#sendMessageButton').click(sendMessage)


  //bind the button
  $('#testButton').click(testButtonFunction)

  //test get call
  $.get('/test?user_name="Fantastic User"',(result)=>{
    console.log(result)
  })


})
