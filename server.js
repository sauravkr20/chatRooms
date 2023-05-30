// this is the backend and 


const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');


const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const http = require('http')

const app = express();

const server = http.createServer(app);



// now we can run when a client connects 
const io = socketio(server);


// Set static folder 
app.use(express.static(path.join(__dirname, 'public')));

const botName = "chatroom:";


// run when client connects

// io.on(connection, ...) sets up an event listenener for the connection event, the event is emmitted by Socket.IO when a new client connects 
io.on('connection', socket => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        // welcome the current user 
        socket.emit('message', formatMessage(botName, 'Welcome to chatRoom'));
        // Broadcast when a user connects, to all users except that connect 
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        // send users and room info 
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });


    // Listen for chatMessage
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    // runs when client disconnects 
    socket.on('disconnect', () => {

        const user = userLeave(socket.id);

        io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, '172.23.23.64', () => console.log(`server running on port ${PORT}`));


