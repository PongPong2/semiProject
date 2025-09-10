const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'master',
    password: 'tiger',
    database: 'dcumusic',
    connectionLimit: 10,
    waitForConnections: true,
});
module.exports = pool;
