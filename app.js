const { connection } = require('./db/mysql');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

const saltRounds = 10;

app.get('/api/user', (req, res) => {
    res.send({
        data: 'ok',
    });
});

app.post('/api/register', (req, res) => {
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

app.listen('3000', () => {
    console.log(' serve is running at http:localhost:3000');
});
