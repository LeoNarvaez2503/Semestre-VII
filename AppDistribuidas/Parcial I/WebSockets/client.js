const io = require('socket.io-client');
const readline = require('readline');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const socket = io(SERVER_URL, {
    transport: ['websocket', 'polling']
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let username = '';

const askUsername = () => {
    return new Promise((resolve) => {
        rl.question('Enter your username: ', (answer) => {
            resolve(answer.trim());
        });
    });
}

const sendMessage = (message) => {
    if(message === '/exit') {
        console.log('Exiting chat...');
        socket.disconnect();
        rl.close();
        process.exit(0);
    }
    socket.emit('chatMessage', { username, message, timestamp: new Date().toLocaleDateString() });
}

const displayMessage = (data, isOwn) => {
    const prefix = isOwn ? 'You' : `${data.username}`;
    console.log(`[${data.timestamp}] ${prefix}: ${data.message}`);
}

socket.on('connect', async () => {
    console.log('Connected to server');
    askUsername().then((name) => {
        username = name;
        socket.emit('set_username', { username });
        console.log(`Welcome, ${username}! You can start chatting. Type /exit to leave.`);
        rl.prompt();
    });
});


socket.on('user_joined', (data) => {
    console.log(`${data.username} has joined the chat.`);
});

socket.on('user_list', (data) => {
    console.log(`Users in the chat: ${data.users.join(', ')} || Just you in the chat!`);
});

socket.on('user_left', (data) => {
    console.log(`${data.username} has left the chat.`);
});

socket.on('chatMessage', (data) => {
    const isOwn = data.username === username;
    displayMessage(data, isOwn);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    rl.close();
    process.exit(0);
});

rl.on('line', (input) => {
    if(input.trim()) {
        sendMessage(input.trim());
    }
    rl.prompt();
}).on('close', () => {
    console.log('Exiting chat...');
    socket.disconnect();
    process.exit(0);
});

rl.setPrompt('>> ');