const chatForm = document.getElementById('chat-form');

const chatMessages = document.querySelector('.chat-messages');

const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username);

const socket = io();

// join chatRoom 
socket.emit('joinRoom', {
    username,
    room
})

// Get room and users 
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
})

// catching the emitted event 
socket.on('message', message => {
    // message is the content of event in this case it is welcome 
    console.log(message);
    outputMessage(message);

    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight * 2;
})


// implementing the messaging 

// Message submit 
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();


    // get message text 
    const msg = e.target.elements.msg.value;



    // emitting a message to the server 
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});




// output Message to DOM 
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username}  <span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}



// Add room name to DOM 
function outputRoomName(room) {
    roomName.innerText = room;
}


// Add users to DOM 

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }