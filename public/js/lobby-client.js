/**
 *  @Author: Qiaoli wang (wangqiao@deakin.edu.au)
 **/
$(function() {

    // connect to the socket
    let socket; socket = io();

    const $userName = $('#userName'),
          $linkBtn = $('.link-button .btn'),
          $createRoombtn = $('#createRoom'),
          $matchRoomBtn = $('#matchRoom');

    let userNameVal;

    $userName.blur(function(){

        userNameVal =$(this).val();
    })

    $linkBtn.on('click', function () {

        if (userNameVal){

            socket.emit('newUser', userNameVal);

            $(this).attr('disabled', true);
            $userName.attr('disabled', true);
            $createRoombtn.attr('disabled', false);

            socket.on('currentUser', (user) => {
                console.log('currentUser: ' + JSON.stringify(user));
            })

        } else {

            M.toast({html: 'Please enter your name!', classes: 'rounded'});
        }

    })


    $createRoombtn.on('click', function () {

        if (userNameVal) {

            socket.emit('createRoom');
            $(this).attr("disabled", true);

        } else {
            M.toast({html: 'Please enter your name!', classes: 'rounded'});
        }
    })

    $('body').on('click','.join-room',function () {

        let roomId = $(this).data().id;
        socket.emit('joinRoom',roomId);
    })

    socket.on('listRooms', (rooms) => {
        console.log('rooms: ' + JSON.stringify(rooms));
        renderRooms(rooms);
    })

    socket.on('errNotice',(err)=>{

        if(err.code ==1){

            M.toast({html: 'You are already in the Room!', classes: 'rounded'});
        }
    })

    renderRooms = (rooms)=>{

        const $roomList = document.getElementById("rooms");
        let roomList = [];
        let userList = [];

        rooms.forEach((room) =>{

            userList = [];

            room.roomUsers.forEach((user)=>{
                userList.push(`<div class="col s1">
                            <i class="small material-icons">account_circle</i>
                            <div class="player-name">${user.name}</div>
                        </div>`)
            })

            roomList.push(`<div class="room-item">
                    <div class="item-left row" id="players">${userList}</div>
                    <div class="item-right">
                        <span class="room-number">Room No : ${room.roomNumber}</span>
                        <a class="join-room btn btn-primary" data-id=${room.id}>Join</a>
                    </div>
                </div>`)
        })


        $roomList.innerHTML = roomList.join("");
    }
})