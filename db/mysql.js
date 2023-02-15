const dotenv = require('dotenv')
const mysql = require('mysql2')
const logger = require('../logger')
dotenv.config()
const {
  DATABASE_MY_HOST,
  DATABASE_MY_POST,
  DATABASE_NAME,
  DATABASE_MY_USERNAME,
  DATABASE_MY_PASSWORD
} = process.env
const connection = mysql.createConnection({
  host: DATABASE_MY_HOST,
  port: DATABASE_MY_POST,
  database: DATABASE_NAME,
  user: DATABASE_MY_USERNAME,
  password: DATABASE_MY_PASSWORD
})

// 心跳检测，防止数据库连接断开
setInterval(() => {
  connection.query('SELECT 1', (err, results) => {
    if (err) {
      return logger.error('心跳检查', err)
    }
    logger.error(' ❤️❤️❤️❤️❤️❤️❤️心跳检查❤️❤️❤️❤️❤️❤️❤️')
  })
}, 1000 * 60 * 5)

module.exports = {
  connection
}
