const chatForm = document.getElementById("chat-form")
const chatMessage = document.getElementById('chat-messages')
const button = document.getElementById('btn-logout')

const socket = io.connect()

const {
    username,
    group
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true,  
})

GROUP_LIST = [
    'Geral',
    'Distribuida',
    'ORG',
    'Calculo',
    'Noticias'
]

let groupImages = {
    'Geral': 'geral.webp',
    'Distribuida': 'distribuida.webp',
    'ORG': 'org.jpg',
    'Calculo': 'calculo.jpg',
    'Noticias': 'noticias.webp',
}

if (!GROUP_LIST.includes(group)) {

    // invalid page group
    window.location.href = '/'
}

let groupImage = groupImages[group]
document.getElementById("group-id").innerHTML = group
document.getElementById("group-image").setAttribute("src", `res/${groupImage}`)

// Join group
socket.emit('joinRoom', {username, group})

socket.on('update', (message) => {
    document.getElementById("count").innerHTML = message
})


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

button.addEventListener('click', function () {
    document.location.href = "http://localhost:8080/logout";
});