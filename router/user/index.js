const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const saltRounds = 10;
const tokenSalt = "token_secret";
const { connection } = require("../../db/mysql");
const auth = require("../../middleware/auth");

router.post("/register", (req, res) => {
  const { userName, passWord } = req.body;
  // 先查询用户是否存在，不存在则注册，否则提示用户已存在
  const sqlUser = `select * from user where user_name= ?`;
  connection.query(sqlUser, [userName], (err, data) => {
    if (data.length !== 0) {
      res.send({
        code: 0,
        msg: "用户已存在",
      });
      return;
    }
    bcrypt.hash(passWord, saltRounds, function (err, hash) {
      if (err) {
        console.log(err);
        return res.send({
          code: 0,
          msg: "服务器错误",
        });
      }
      // const sql = `insert into user(user_name, pass_word) values('${userName}', '${hash}')`;
      const sql = `insert into user set ?`;
      connection.query(sql, { user_name: userName, passWord: pas}, (err, data) => {
        if (!err) {
          res.send({
            code: 1,
            msg: "注册成功",
          });
          return;
        }
        res.send({
          code: 500,
          msg: err,
        });
      });
      console.log(hash);
    });
  });
});

// 用户登录
router.post("/login", (req, res) => {
  const { userName, passWord } = req.body;
  // 验证密码是否正确
  const sql = `select * from user where user_name= ?`;
  connection.query(sql, [userName], (err, data) => {
    if (!err) {
      if (data.length > 0) {
        const passWordHash = data[0].pass_word;
        const id = data[0].id;
        bcrypt.compare(passWord, passWordHash, (err, isTrue) => {
          const token = jwt.sign({ id }, tokenSalt);
          console.log(token, "token");
          if (isTrue) {
            res.send({
              code: 1,
              msg: "登录成功",
              token,
            });
            return;
          }
          res.send({
            code: 0,
            msg: "密码不正确",
          });
          return;
        });
      } else {
        res.send({
          code: 0,
          msg: "用户不存在",
        });
      }
    }
  });
});

// 获取用户信息
router.get("/profile", auth, async (req, res) => {
  const { id, user_name } = req.user;
  res.send({
    code: 1,
    msg: "获取用户信息成功",
    data: {
      id,
      userName: user_name,
    },
  });
});

router.post("/updateUser", auth, async (req, res) => {
  const { userName, id, email, phone } = req.body;
  const sql = "update user set user_name=?, email=?, phone=? where id=?";
  connection.query(sql, [userName, email, phone, id], (err, data) => {
    if (err) {
      res.send({
        code: 0,
        msg: "修改失败",
        e: err,
      });
      return;
    }
    res.send({
      code: 1,
      msg: "修改成功",
    });
  });
});

router.get("/list", auth, async (req, res) => {
  const sql = `select * from user`;
  connection.query(sql, (err, data) => {
    if (!err) {
      res.send({
        code: 1,
        msg: "获取用户列表成功",
        data: data.map((item) => ({
          userName: item.user_name,
          id: item.id,
          phone: item.phone,
          email: item.email,
        })),
      });
      return;
    }
    res.send({
      code: 0,
      msg: "获取用户列表失败",
    });
  });
});

module.exports = router;
