const { connection } = require("./db/mysql");
const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/user", (req, res) => {
  res.send({
    data: "ok",
  });
});

app.post("/api/register", (req, res) => {
  console.log(req.body)
  const { userName, passWord } = req.body;

  const sql = `insert into user(user_name, pass_word) values('${userName}', '${passWord}')`;
  connection.query(sql, (err, data) => {
    if (!err) {
      console.log(err)
      // res.statusCode(500).send({
      //   msg: "服务端错误",
      // });
    }
    console.log(data)
    res.send({
      code: 0,
      msg: "注册成功",
    });
  });

});

app.listen("3000", () => {
  console.log(" serve is running at http:localhost:3000");
});
