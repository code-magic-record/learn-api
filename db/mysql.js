const dotenv = require("dotenv");
const mysql = require("mysql2");
dotenv.config();
const {
  DATABASE_MY_HOST,
  DATABASE_MY_POST,
  DATABASE_NAME,
  DATABASE_MY_USERNAME,
  DATABASE_MY_PASSWORD,
  DATABASE_MY_POOLSIZE,
} = process.env;
console.log(dotenv.config());
const connection = mysql.createConnection({
  host: DATABASE_MY_HOST,
  port: DATABASE_MY_POST,
  database: DATABASE_NAME,
  user: DATABASE_MY_USERNAME,
  password: DATABASE_MY_PASSWORD,
});

console.log("Creted a connection to mysql");

function handleError(err) {
  if (err) {
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connection.connect();
    } else {
      console.error(err.stack || err);
    }
  }
}
connection.connect(handleError)
connection.on('error', handleError);


module.exports = {
  connection,
};
