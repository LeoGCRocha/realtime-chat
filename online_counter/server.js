const {createAdapter} = require('@socket.io/redis-adapter').createAdapter
const SERVERID = process.env.SERVERID;
const PORT = process.env.PORT;
const { Server } = require("socket.io")

// Message Broker 
const redis = require('redis')
const io = new Server(PORT)
const client = require('socket.io-client')

// Redis port is 6379
// All user are listeners and subscribers
async function start() {
    const pubClient = redis.createClient({url: 'redis://rds:6379'})
    const subClient = pubClient.duplicate()
    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        io.adapter(createAdapter(pubClient, subClient))
    })
}
start();

let currentOnlinseUsers = {
    'Geral': 0,
    'Distribuida': 0,
    'ORG': 0,
    'Calculo': 0,
    'Noticias': 0
}

io.on('connection', (socket) => {
    socket.emit('onlineUsers', currentOnlinseUsers['Geral'])
    // change this
    console.log("emit send xxdp")
})

// connection 
client(`http://localhost:${PORT}`)