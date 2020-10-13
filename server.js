const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const mongo = require('./services/MongoService')
const PORT = 3000;

let http = require('http').createServer(app);
let io = require('socket.io')(http);

const { addUser, removeUser, getUser, listUser } = require('./controllers/userController');

// for hosting static files (html)
app.use(express.static(__dirname + '/public'));

// need to add the body parser so that we can extract the body data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//socket connection
io.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    setInterval(()=>{
        socket.emit('number', parseInt(Math.random()*10));
    }, 1000);


    /**
     *  new user connected
     *  @Author: Qiaoli wang (wangqiao@deakin.edu.au)
     */
    socket.on('newUser', (name) => {

        const user = addUser({ id: socket.id,name});

        let userList = listUser();

        console.log(userList);

    })

});


// setup the DB
mongo.startDB()

// liston to the port 3000
http.listen(PORT,function () {
    console.log(`web server running at: http://localhost:${PORT}`)
})