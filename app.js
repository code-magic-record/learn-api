const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
    res.send({
        data: 'ok',
    });
});

app.post('/api/register', async (req, res) => {
    console.log(req.body);
    res.send('ok');
});

app.get('/api/profile', async (req, res) => {
    // const raw = req.body.headers.authorization.split('').pop()
    // 验证token
    // jwt
    // const tokenData = jwt.verify(raw, 密钥) // 对象
    // const { id } = tokenData; // id 是加密的用户ID
});

app.listen('3000', () => {
    console.log(' serve is running at http:localhost:3000');
});
