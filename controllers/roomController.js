/**
 * @Author: Qiaoli wang (wangqiao@deakin.edu.au)
 **/

const rooms = [];
let roomUsers = [];
let number = 0;

// Last activity timestamp
let lastActivityTimeStamp;

// The maximum time that a room can be idle.
let idleLimit = 10 * 60 * 1000;

let gameStarted = false;

/**
 * create a room
 * @param id
 * @param owner
 * @returns {{room: {id: *, roomNumber: number, roomUsers: Array}}}
 */
const createRoom = (id,owner) =>{

    let roomNumber = getNextRoomNumber();

    lastActivityTimeStamp = new Date();

    const existingRoom = rooms.find((room) => room.id === id);

    if (existingRoom){

        console.log('Room is taken.');
    }

    roomUsers = [];
    gameStarted = false;

    const room = {id,roomNumber,roomUsers,gameStarted};

    ownerJoinRoom(room,owner);

    rooms.push(room);

    return { room };
}

/**
 * remove a room by id
 * @param id
 * @returns {*}
 */
const removeRoom = (roomList,id) =>{

    const index = roomList.findIndex((room) => room.id === id);

    if (index !== -1) {

        roomList.splice(index,1)[0];
    }
}

/**
 * get a room by id
 * @param id
 * @returns {*}
 */
const getRoom = (id) => rooms.find((room) => room.id === id);

/**
 * list all rooms
 * @returns {Array}
 */
const listRooms = () =>{
    return rooms;
}

/**
 * create room number
 * @returns {number}
 */
const getNextRoomNumber = () =>{
    return number ++;
}

const isActive =() =>{
    return (new Date().getTime() - lastActivityTimeStamp.getTime()) > idleLimit;
}
/**
 * The room owner join room
 * @param room
 * @param user
 */
const ownerJoinRoom =(room,user) =>{
    let joinUser = user;
    joinUser.isInRoom = true;
    room.roomUsers.push(joinUser);
}


module.exports ={
    createRoom,
    removeRoom,
    getRoom,
    listRooms,
}