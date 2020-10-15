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

    let roomList;
    /**
     * get user name
     */
    let userNameVal;

    $userName.blur(function(){

        userNameVal =$(this).val();
    })

    /**
     *  link the user to socket
     */
    $linkBtn.on('click', function () {

        if (userNameVal){

            socket.emit('newUser', userNameVal);

            $(this).attr('disabled', true);
            $userName.attr('disabled', true);
            $createRoombtn.attr('disabled', false);
            $matchRoomBtn.attr('disabled',false);

            socket.on('currentUser', (user) => {
                console.log('currentUser: ' + JSON.stringify(user));
            })

        } else {

            M.toast({html: 'Please enter your name!', classes: 'rounded'});
        }

    })

    /**
     * user create a room
     */
    $createRoombtn.on('click', function () {

        if (userNameVal) {

            socket.emit('createRoom');
            $(this).attr("disabled", true);
            $matchRoomBtn.attr('disabled',true);

        } else {
            M.toast({html: 'Please enter your name!', classes: 'rounded'});
        }
    })

    /**
     *  user join a room
     */
    $('body').on('click','.join-room',function () {
        let roomId = $(this).data().id;
        socket.emit('joinRoom',roomId);
    })

    /**
     *  user match a room
     */
    $matchRoomBtn.on('click',function () {
        if (roomList.length > 0){
            socket.emit('matchRoom');
        }else {
            M.toast({html: 'Not a room is available, You can create a room!', classes: 'rounded'});
        }
    })

    /**
     *  get room list
     */
    socket.on('listRooms', (rooms) => {
        console.log('rooms: ' + JSON.stringify(rooms));
        roomList = rooms;
        renderRooms(rooms);
    })

    /**
     *  get error content
     */
    socket.on('errNotice',(err)=>{

        if(err.code ==1){

            M.toast({html: 'You are already in a Room!', classes: 'rounded'});
        }
    })

    /**
     * render rooms
     * @param rooms
     */
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