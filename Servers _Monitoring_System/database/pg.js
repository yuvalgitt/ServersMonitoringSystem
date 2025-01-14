const {Client} = require('pg')

const pgClient = new Client({
    host : 'localhost',
    user : 'postgres',
    port : "5432",
    password :'qweasdzxc1!',
    database :'ServerMonitoring'
})

module.exports = pgClient