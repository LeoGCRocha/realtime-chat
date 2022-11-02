const express = require('express')
const path = require('path')
const http = require('http')
const socket = require('socket.io')
const patternMessage = require('./public/js/message')
const {userJoin, getUser, userLeave} = require('./public/js/users')

const PORT = 3000 || process.env.PORT

const app = express()
const server = http.createServer(app)
const io = socket(server)

io.on('connect', (socket) => {   

    // Listen some group
    socket.on('joinRoom', ({username, group}) => {
        
        // Join user in a group
        const user = userJoin(socket.id, username, group)
        socket.join(user.group)

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
        io.to(user.group).emit('message', patternMessage(user.username, message))
    })    
})

// Define static folder to get resources
app.use(express.static(path.join(__dirname, 'public')))

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))