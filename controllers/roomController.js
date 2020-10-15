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

const createRoom = (id,owner) =>{

    let roomNumber = getNextRoomNumber();

    lastActivityTimeStamp = new Date();

    const existingRoom = rooms.find((room) => room.id === id);

    if (existingRoom){

        console.log('Room is taken.');
    }

    roomUsers = [];

    const room = {id,roomNumber,roomUsers};

    userJoinRoom(room,owner);

    rooms.push(room);

    return { room };
}

const removeRoom = (id) =>{

    const index = rooms.findIndex((room) => room.id === id);

    if (index !== -1) return rooms.splice(index,1)[0];
}

const getRoom = (id) => rooms.find((room) => room.id === id);


const listRooms = () =>{
    return rooms;
}

const getNextRoomNumber = () =>{
    return number ++;
}

const isActive =() =>{
    return (new Date().getTime() - lastActivityTimeStamp.getTime()) > idleLimit;
}

const userJoinRoom =(room,user) =>{
    room.roomUsers.push(user);
}


module.exports ={
    createRoom,
    removeRoom,
    getRoom,
    listRooms,
    userJoinRoom
}