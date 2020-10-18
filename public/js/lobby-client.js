/**
 *  @Author: Qiaoli wang (wangqiao@deakin.edu.au)
 **/
$(function() {

    // connect to the socket
    let socket; socket = io();

    const $userName = $('#userName'),
          $linkBtn = $('.link-button .btn'),
          $createRoombtn = $('#createRoom'),
          $matchRoomBtn = $('#matchRoom'),
          $lobbyOperatorBox = $('.lobby-operator-box'),
          $roomDetails = $('.room-details'),
          $addBot = $(' #addBot');

    let roomList,currentUser;
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
                currentUser = user;
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
     * add a bot
     */
    $('body').on('click','.add-bot-btn',function(){
        let roomId = $(this).data().id;
        socket.emit('addBot',roomId);
    })
    /**
     *  user join a room
     */
    $('body').on('click','.join-room',function () {
        if (userNameVal && currentUser) {
            let roomId = $(this).data().id;
            socket.emit('joinRoom', roomId);
        }else {
            M.toast({html: 'Please enter your name! and click Link to connect', classes: 'rounded'});
        }
    })
    /**
     * user leave room
     */
    $('body').on('click','.leave-btn',function () {
        let roomId = $(this).data().id;
        socket.emit('leaveRoom',roomId);
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
     *  get current room
     */
    socket.on('currentRoom',(room) =>{
        if (room){
            $lobbyOperatorBox.hide();
            $roomDetails.show();
            renderRoom(room);
        }else {
            if(currentUser){
                $createRoombtn.attr('disabled',false);
                $matchRoomBtn.attr('disabled',false);
            }
            $lobbyOperatorBox.show();
            $roomDetails.hide();
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
        let userList = [],$userListHtml;
        let userNumber,$joinBtnHtml;
        let $userIcon;

        rooms.forEach((room) =>{

            userList = [];
            userNumber = room.roomUsers.length;

            $joinBtnHtml = userNumber >= 7
                ? `<a class="join-room btn btn-primary" disabled>Full</a>`
                : `<a class="join-room btn btn-primary" data-id=${room.id}>Join</a>`;

            room.roomUsers.forEach((user)=>{

                $userIcon = user.isBot ? `<i class="small material-icons">airplay</i>` : `<i class="material-icons small">account_circle</i>`;
                userList.push(`<div class="col s1">
                            ${$userIcon}
                            <div class="player-name">${user.name}</div>
                        </div>`)
            })

            $userListHtml = userList.join('');

            roomList.push(`<div class="room-item">
                    <div class="item-left row" id="players">${$userListHtml}</div>
                    <div class="item-right">
                        <span class="room-number">Room No : ${room.roomNumber}</span>
                        ${$joinBtnHtml}
                    </div>
                </div>`)
        })


        $roomList.innerHTML = roomList.join(" ");
    }
    /**
     * display room
     * @param room
     */
    renderRoom = (room) =>{

        const $room = document.getElementById("room");
        let playerList = [],$playersHtml;
        let currentRoom =room;
        let userNumber = currentRoom.roomUsers.length;
        let $userIcon;
        let $addBotBtn;

        $addBotBtn = userNumber >= 7
            ? `<a id="addBot" disabled class="add-bot-btn btn btn-secondary">add a bot</a>`
            : `<a id="addBot" class="add-bot-btn btn btn-secondary" data-id =${room.id}>add a bot</a>`;

        currentRoom.roomUsers.forEach((user)=>{
            $userIcon = user.isBot ? `<i class="medium material-icons">airplay</i>` : `<i class="material-icons medium">account_box</i>`;
            playerList.push(`<div class="user-item player">${$userIcon} <div class="player-name">${user.name}</div></div>`)

        })

        $playersHtml = playerList.join('');

        let $roomHtml = `<div class="user-operator">
                           
                            <div class="room-users">
                                ${$playersHtml}
                            </div>
                        </div>
                       ${$addBotBtn}
                       <a class="start-game btn btn-primary" data-id =${room.id}>start game</a>
                       <a class="leave-btn btn btn-secondary" data-id =${room.id}>Leave</a>`

        $room.innerHTML = $roomHtml;
    }
})