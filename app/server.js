const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')
const patternMessage = require('./public/js/message')
const {userJoin, getUser, userLeave} = require('./public/js/users')
const {createAdapter} = require('@socket.io/redis-adapter').createAdapter
const SERVERID = process.env.SERVERID;
const PORT = process.env.PORT;

// Message Broker 
const redis = require('redis')

const app = express()
const server = http.createServer(app)
const io = socket(server)
    
app.route('/').get((req, res) => {
    res.sendFile(path.join(__dirname, '/public/slash.html'))
})

app.route('/logout').get((_, res) => {
    res.sendFile(path.join(__dirname, '/public/logout.html'))
})

app.route('/chat').get((req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
})

// Redis port is 6379
// All user are listeners and subscribers
let pubClient, subClient
(async () => {
    pubClient = redis.createClient({url: 'redis://rds:6379'})
    subClient = pubClient.duplicate()
    Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
        io.adapter(createAdapter(pubClient, subClient))
    })
})()

io.on('connect', (socket) => {   
    
    // Listen some group
    socket.on('joinRoom', ({username, group}) => {

        console.log(`Server ${SERVERID} is serving client ${username} in group ${group}`)

        pubClient.publish('online_counter', `${username}#${group}`)
        
        subClient.subscribe(`update_${group}`, (message) => {
            socket.emit('update', message)
        })

        // Join user in a group
        const user = userJoin(socket.id, username, group)

        //   Notify the other users that a new user has joined the chat
        socket.broadcast.to(user.group).emit('message', patternMessage('Admin', `O usuário ${user.username} entrou no chat`))

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
                    
                pubClient.publish('offline_counter', `${user.username}#${user.group}`)
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