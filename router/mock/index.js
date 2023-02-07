const { connection } = require("../../db/mysql");
const { data } = require("../../mock/user");
console.log(data, 'list');
const { list } = data;
const sql = 'insert into emp(name, age, staff, create_time) values (?,?,?, now())';

function insetIntoUser(obj) {
  obj.list.forEach((item) => {
    const { name, age, staff } = item;
    connection.query(sql, [name, age, staff], (err, result) => {
      if (err) {
        console.log(err, 'err');
        return;
      }
      console.log('写入成功');
    })
  });
}

insetIntoUser(data);