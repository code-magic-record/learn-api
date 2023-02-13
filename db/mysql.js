const dotenv = require("dotenv");
const mysql = require("mysql2");
const logger = require("../logger");
dotenv.config();
const {
  DATABASE_MY_HOST,
  DATABASE_MY_POST,
  DATABASE_NAME,
  DATABASE_MY_USERNAME,
  DATABASE_MY_PASSWORD,
} = process.env;
console.log(dotenv.config());
const connection = mysql.createConnection({
  host: DATABASE_MY_HOST,
  port: DATABASE_MY_POST,
  database: DATABASE_NAME,
  user: DATABASE_MY_USERNAME,
  password: DATABASE_MY_PASSWORD,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0
});

function handleError(err) {
  if (err) {
    // 如果是连接断开，自动重新连接
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      logger.info('数据库连接断开，正在重新连接...');
      connection.connect();
    } else {
      logger._log('数据🔗断开、重新连接失败', err);
      console.error(err.stack || err);
    }
  }
}
connection.connect(handleError)
connection.on('error', handleError);


module.exports = {
  connection,
};
