const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')
const patternMessage = require('./public/js/message')
const {userJoin, getUser, userLeave} = require('./public/js/users')
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
    
app.route('/logout').get((req, res) => {
    res.sendFile(path.join(__dirname, '/public/logout.html'))
})

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
        console.log(io.engine.clientsCount)

        //   Notify the other users that a new user has joined the chat
        socket.broadcast.to(user.group).emit('message', patternMessage('Admin', `O usuário ${user.username} entrou no chat`))

        try {    
            // When Redis is set as a message broker all emit messages are controlled by Redis
            let currentOnlinseUsers = io.sockets.adapter.rooms.get(user.group).size

            let users = io.sockets.adapter.rooms.get(user.group)
            console.log(users)

            // Send current online users to all users in the group
            socket.to(user.group).emit('userCount', currentOnlinseUsers.toString())
            socket.emit('userCount', currentOnlinseUsers.toString())
        } catch (error) {
            console.log(error)
        }
    })

    // Disconnect the user
    socket.on('disconnect', () => {
        try {
            user = userLeave(socket.id)
            if (user !== undefined) {
                user = user[0]
                let currentOnlinseUsers = io.sockets.adapter.rooms.get(user.group)
                if (currentOnlinseUsers !== undefined) {
                    currentOnlinseUsers = currentOnlinseUsers.size
                    socket.to(user.group).emit('userCount', currentOnlinseUsers.toString())
                }
                io.to(user.group).emit('message', 
                    patternMessage('Admin', `O usuário ${user.username} acabou de se desconectar.`))
            }
        } catch (error) {
            console.log(error)
        }   
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