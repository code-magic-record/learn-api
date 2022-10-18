const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const saltRounds = 10;
const tokenSalt = 'token_secret';
const { connection } = require('../../db/mysql');

router.post('/register', (req, res) => {
    const { userName, passWord } = req.body;
    bcrypt.hash(passWord, saltRounds, function (err, hash) {
        if (err) {
            console.log(err);
            return res.send({
                code: 0,
                msg: '服务器错误',
            });
        }
        const sql = `insert into user(user_name, pass_word) values('${userName}', '${hash}')`;
        connection.query(sql, (err, data) => {
            if (!err) {
                res.send({
                    code: 0,
                    msg: '注册成功',
                });
                return;
            }
            res.send({
                code: 500,
                msg: '服务端错误',
            });
        });
        console.log(hash);
    });
});

// 用户登录
router.post('/login', (req, res) => {
    const { userName, passWord } = req.body;
    // 验证密码是否正确
    const sql = `select * from user where user_name='${userName}'`;
    connection.query(sql, (err, data) => {
        if (!err) {
            if (data.length > 0) {
                const passWordHash = data[0].pass_word;
                const id = data[0].id;
                bcrypt.compare(passWord, passWordHash, (err, isTrue) => {
                    const token = jwt.sign(id, tokenSalt);
                    console.log(token, 'token');
                    if (isTrue) {
                        res.send({
                            code: '0',
                            msg: '登录成功',
                            data: data[0],
                            token,
                        });
                        return;
                    }
                    res.send({
                        code: 0,
                        msg: '密码不正确',
                    });
                    return;
                });
            } else {
                res.send({
                    code: 0,
                    msg: '用户不存在',
                });
            }
        }
    });
});

module.exports = router;
