const users_online = [];

// User current in chat
function userJoin(id, username, group) {

    const user = { id, username, group }

    users_online.push(user);
    
    return user;
}

function getUser(id) {
    return users_online.find(user => user.id === id)
}

function userLeave(id) {
    const index = users_online.findIndex(user => user.id === id)
    
    if (index !== -1) {
        return users_online.splice(index, 1)[0]
    }
}

module.exports = {
    userJoin,
    getUser,
    userLeave
}