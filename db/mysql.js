const dotenv = require("dotenv");
const mysql = require("mysql2");
const { data } = require("../mock/user");
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

function insertUser() {
  console.log(data);
  data.list.forEach((item) => {
    const sql = `
      insert into user(user_name, pass_word) values('${item.name}', '${item.password}')
    `;
    connection.query(sql, (err, data) => {
      console.log(err, data);
    });
  });
}

module.exports = {
  connection,
};
// insertUser()

// connection.query("select * from user", function(err, res) {
//   console.log(res)
// })
