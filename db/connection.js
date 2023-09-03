const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'test',
      database: 'company_db'
    },
    console.log(`Connected to the Company database.`)
  );

module.exports = db
