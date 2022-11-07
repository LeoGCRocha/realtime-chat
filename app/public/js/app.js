const chatForm = document.getElementById("chat-form")
const chatMessage = document.getElementById('chat-messages')
const socket = io.connect()


// Define username and current group
// There are two options of groups 
// 1. Grupo Geral
// 2. Grupo de Estudos Computação Distribuida

const {
    username,
    group
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,  
})

// Join group
socket.emit('joinRoom', {username, group})

// User connection
socket.on('message', message => {
    showMessage(message)

    // Scroll
    chatMessage.scrollTop = chatMessage.scrollHeight
})

// Add a new message
chatForm.addEventListener('submit', (action) => {
    action.preventDefault()
    const message = action.target.elements.msg.value

    // Send message to the server
    socket.emit('chatMessage', message)

    // CLear input form
    action.target.elements.msg.value = ''
    action.target.elements.msg.focus()
})

// Show message in HTML
function showMessage(message) {
    const div = document.createElement('div')
    div.classList.add('chat-messages-content')
    div.innerHTML = `<div class="message-box">
    <p class="information"> ${message.username} </p>
        <p class="text">
            ${message.text}
        </p>
        <p class="time"> ${message.time} </p>
    </div>`
    document.getElementById('chat-messages').appendChild(div)
}
