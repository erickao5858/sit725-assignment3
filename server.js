const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const mongo = require('./services/MongoService')
const PORT = 3000;

let http = require('http').createServer(app);
let io = require('socket.io')(http);

// for hosting static files (html)
app.use(express.static(__dirname + '/public'));

// need to add the body parser so that we can extract the body data
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//socket test
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    //function for game chat
    //author:zilin
    socket.on('chat_message', function (data) {
        io.sockets.emit('chat_message', data);
        });
    setInterval(()=>{
        socket.emit('number', parseInt(Math.random()*10));
    }, 1000);
});


// setup the DB
mongo.startDB()

// liston to the port 3000
http.listen(PORT,function () {
    console.log(`web server running at: http://localhost:${PORT}`)
})