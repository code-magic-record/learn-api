# learn-api

## 实现用户的注册登陆

### 实现注册接口
1. 解决密码加蜜后放入数据库

```js
// 加密过程
const saltRounds = 10;
bcrypt.hash(passWord, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    console.log(hash)
    res.send('ok')
});
```

```js
// 用户输入的password 解密过程--- result 为 true则成功
bcrypt.compare(passWord, saltRounds, function(err, result) {
  // result == true
  console.log(result, 'result')
});
```

初步注册代码
```js
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
```


### 实现接口登录代码

- 登录需要进行验签 继续使用bcrypt密码进行对比
- 生成一个token

如何生成token
- jsonwebtoken

```js
const jwt = require('jsonwebtoken')
const token = jwt.sign({
  id: '',
}, '密钥') // ID, 密钥唯一值 可定义在env中
```

简答实现

- 需要

```js
// 用户登录
app.post('/api/login', (req, res) => {
    const { userName, passWord } = req.body;
    // 验证密码是否正确
    const sql = `select * from user where user_name='${userName}'`;
    connection.query(sql, (err, data) => {
        if (!err) {
            if (data.length > 0) {
                const passWordHash = data[0].pass_word;
                const id = data[0].id
                bcrypt.compare(passWord, passWordHash, (err, isTrue) => {
                    const token = jwt.sign(id, tokenSalt)
                    console.log(token, 'token')
                    if (isTrue) {
                        res.send({
                            code: '0',
                            msg: '登录成功',
                            data: data[0],
                            token
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
```