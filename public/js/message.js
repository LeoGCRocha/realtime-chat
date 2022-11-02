const moment = require('moment')

function patternMessage(username, text) {
    
    return {
        username: username,
        text: text,
        time: moment().format('h:mm')
    }
}

module.exports = patternMessage