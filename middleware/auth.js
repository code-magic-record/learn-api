const tokenSalt = 'token_secret';
const jwt = require('jsonwebtoken');
const { connection } = require('../db/mysql');

const auth = (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop();
    let tokenData = {};
    try {
        tokenData = jwt.verify(raw, tokenSalt);
    } catch (e) {
        res.send({
            code: 0,
            msg: '无效token',
        });
    }
    const { id } = tokenData;
    const sql = `select * from user where id = ${id}`;
    connection.query(sql, (err, data) => {
        if (err) {
            res.send({
                code: 0,
                msg: '系统错误',
            });
            return;
        }
        req.user = data[0];
        next();
    });
};

module.exports = auth;
