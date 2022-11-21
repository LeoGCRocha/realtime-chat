const redis = require('redis');

let userController = {
    'Geral': 0,
    'Distribuida': 0,
    'ORG': 0,
    'Noticias': 0,
}

// Redis port is 6379
// All user are listeners and subscribers
let pubClient, subClient;
(async () => {
    pubClient = redis.createClient({url: 'redis://rds:6379'})
    subClient = pubClient.duplicate()

    subClient.connect()
    pubClient.connect()

    subClient.subscribe('online_counter', (userJoin) => {
        let arr = userJoin.split('#')
        userController[arr[1]] += 1
        console.log("Online Counter: Usuário logou: " + arr[0])
        console.log(`Online Counter: Usuários online no grupo ${arr[1]}: ${userController[arr[1]]}`)

        pubClient.publish(`update_${arr[1]}`, `${userController[arr[1]]}`)
    })

    subClient.subscribe('offline_counter', (userLeave) => {
        let arr = userLeave.split('#')
        if (userController[arr[1]] > 0) {
            userController[arr[1]] -= 1
        }
        console.log("Online Counter: Usuário saiu: " + arr[0])
        console.log(`Online Counter: Usuários online no grupo ${arr[1]}: ${userController[arr[1]]}`)
        pubClient.publish(`update_${arr[1]}`, `${userController[arr[1]]}`)
    })
})();
