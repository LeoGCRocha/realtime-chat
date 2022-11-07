const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')
const patternMessage = require('./public/js/message')
const {userJoin, getUser, userLeave, usersOnline} = require('./public/js/users')
const {createAdapter} = require('@socket.io/redis-adapter').createAdapter

// Message Broker 
const redis = require('redis')

// Use default port as 3000 or use the port provided by the command line
let PORT = 3000 

if (process.argv[2] !== undefined) {
    PORT = process.argv[2]
}

const app = express()
const server = http.createServer(app)
const io = socket(server)
    
// Redis port is 6379
// All user are listeners and subscribers
let pubClient, subClient
async function start() {
    pubClient = redis.createClient({url: 'redis://localhost:6379'})
    subClient = pubClient.duplicate()
    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        io.adapter(createAdapter(pubClient, subClient))
    })
}
start();

io.on('connect', (socket) => {   
    // Listen some group
    socket.on('joinRoom', ({username, group}) => {
        
        // Join user in a group
        const user = userJoin(socket.id, username, group)
        socket.join(user.group)


        // Subscriber listening to value
        subClient.subscribe(user.group, (message) => {
            socket.to(user.group).emit('updateCount', message)
        });
        
        // Publish sends value
        pubClient.publish(user.group, usersOnline().toString())
        
        //   Notify the other users that a new user has joined the chat
        socket.broadcast.to(user.group).emit('message', patternMessage('Admin', `O usuário ${user.username} entrou no chat`))

        // Disconnect the user
        socket.on('disconnect', () => {
            const user = userLeave(socket.id)
            io.to(user.group).emit('message', 
                patternMessage('Admin', `O usuário ${user.username} acabou de se desconectar.`))

        })
    })


    // Listen to client messages
    socket.on('chatMessage', (message) => {
        const user = getUser(socket.id)

        // Send message to the group
        io.to(user.group).emit('message', patternMessage(user.username, message))
    })    
})

// Define static folder to get resources
app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))