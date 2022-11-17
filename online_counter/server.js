const SERVERID = process.env.SERVERID;
const PORT = process.env.PORT;
const redis = require('redis');
// const {Server} = require('socket.io');
// const io = require('socket.io-client');

// Redis port is 6379
// All user are listeners and subscribers
let pubClient, subClient;
(async () => {
    console.log("User online counter is running");
    pubClient = redis.createClient({url: 'redis://rds:6379'})
    subClient = pubClient.duplicate()

    await pubClient.connect()

    pubClient.publish('online_counter', 'Registering user online counter')

})();

// const {Server} = require('socket.io');
// const io = new Server(PORT);
// const client = require('socket.io-client')

// io.on('connection', (socket) => {
//     subClient.subscribe('new_connection', (message) => {
//         console.log("New connection")
//     })

//     subClient.on('new_connection', (channel, message) => {

//     })
// })

// client(`http://localhost:${PORT}`)