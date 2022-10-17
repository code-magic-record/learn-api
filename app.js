const { connection } = require('./db/mysql');
const express = require('express');
const app = express();
app.use(express.json());
app.get('/api', (req, res) => {
    console.log(req.route)
    res.send({
        data: 'ok',
    });
});

app.post('/api/register', async (req, res) => {
    console.log(req.body);
    res.send('ok');
});

// app.get('/api/profile', async (req, res) => {
//     // const raw = req.body.headers.authorization.split('').pop()
//     // 验证token
//     // jwt
//     // const tokenData = jwt.verify(raw, 密钥) // 对象
//     // const { id } = tokenData; // id 是加密的用户ID
// });


app.get('/api/profile', async(req, res) => {
    // await connection.query(`select * from user where id = ${req.body.id}`, (err, data) => {
    //     if (!err) return
    //     res.send(data)
    // })

    res.send("ok")
})

app.get('/api/baidu', (req, res) => {
    res.redirect('https:www.baidu.com')
})

app.listen('3000', () => {
    console.log(' serve is running at http:localhost:3000');
});
