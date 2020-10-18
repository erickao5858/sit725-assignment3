const express = require('express')
const bodyParser = require('body-parser');
const path = require('path');
const app = express()
const mongo = require('./services/MongoService')
const PORT = 7070;

let http = require('http').createServer(app);
let io = require('socket.io')(http);


// for hosting static files (html)
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html'); 
app.all('/rules',function(req,res){
    res.sendFile(path.join(__dirname+'/public/rules.html'));
    // return res.redirect('/index');
});

app.all('/lobby',function(req,res){
    res.sendFile(path.join(__dirname+'/public/lobby.html'));
    // return res.redirect('/index');
});





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
    setInterval(()=>{
        socket.emit('number', parseInt(Math.random()*10));
    }, 1000);

});

// setup the DB
mongo.startDB()

// liston to the port 3000
http.listen(PORT,function (err) {
    if (err) console.log(err); 
    console.log(`web server running at: http://localhost:${PORT}`)
})