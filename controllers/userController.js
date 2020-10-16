/**
 * @Author: Qiaoli wang (wangqiao@deakin.edu.au)
 **/

const users = [];
/**
 * add a user
 * @param id
 * @param name
 * @param isInRoom
 * @param isBot
 * @returns {{user: {id: *, name: String.name | *, isInRoom: *, isBot: *}}}
 */
const addUser = ({id,name,isInRoom,isBot}) =>{

    name = name.trim();

    const user = {id,name,isInRoom,isBot};

    users.push(user);

    return { user };
}

/**
 * remove a user
 * @param id
 * @returns {*}
 */
const removeUser = (id) =>{

    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) return users.splice(index,1)[0];
}

/**
 * get user info
 * @param id
 * @returns {*}
 */
const getUser = (id) => users.find((user) => user.id === id);

/**
 * all the users
 * @returns {Array}
 */
const listUsers = () =>{
    return users;
}


module.exports ={
    addUser,
    removeUser,
    getUser,
    listUsers
}