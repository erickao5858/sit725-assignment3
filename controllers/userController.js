/**
 * @Author: Qiaoli wang (wangqiao@deakin.edu.au)
 **/

const users = [];

const addUser = ({id,name}) =>{

    name = name.trim();

    const user = {id,name};

    users.push(user);

    return { user };
}

const removeUser = (id) =>{

    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index,1)[0];
}

const getUser = (id) => users.find((user) => user.id === id);


const listUsers = () =>{
    return users;
}


module.exports ={
    addUser,
    removeUser,
    getUser,
    listUsers
}