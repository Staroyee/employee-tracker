const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'w34pker',
      database: 'company_db'
    },
    console.log(`Connected to the Company database.`)
  );

module.exports = db
