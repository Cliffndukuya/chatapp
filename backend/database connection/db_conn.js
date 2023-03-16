const Pool = require('pg').Pool


//code for database connection
const pool = new Pool({
    user: 'postgres',  //Database username
    host: 'localhost', 
    database: 'partytainers',
    password: 'admin',
    port: 5432,
  })

  
pool.connect((err,) => {
    if (err) {
        return console.error('Error acquiring client', err.stack)
    }else{
        console.log("Database connected");
    }
   
})

module.exports = pool;