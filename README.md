# learn-api

## mysql

```sql
-- 创建数据库
create database user;
```


```sql
-- 创建user表
create table user(
  id int auto_increment primary key,
  user_name varchar(10) comment '用户名',
  pass_word varchar(255) comment '用户密码'
) comment '用户表';

desc user; # 查询表结构
```

## 实现用户的注册登陆

### 实现注册接口
1. 解决密码加密后放入数据库

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

### 获取个人信息
- 如何使用token

```js
// 解析token
const raw = String(req.headers.authorization).split(' ').pop();
const tokenData = jwt.verify(raw, tokenSalt);
const { id } = tokenData;
```


简单实现
```js
// 获取用户信息
router.get('/profile', async (req, res) => {
    // console.log(req.headers.authorization)
    const raw = String(req.headers.authorization).split(' ').pop();
    const tokenData = jwt.verify(raw, tokenSalt);
    const { id } = tokenData;
    const sql = `select * from user where id = ${id}`
    connection.query(sql, (err, data) => {
      if (err) {
        res.send({
          code: 0,
          msg: '系统错误'
        })        
        return
      }

      res.send({
        code: 1,
        msg: '获取用户信息成功',
        userInfo: data[0]
      })
    })

});
```

### 如何使用中间件鉴权

写一个中间件

```js
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
        req.body = data[0];
        next();
    });
};

module.exports = auth;
```

使用中间件
```js
// 获取用户信息
router.get('/profile', auth, async (req, res) => {
    console.log(req.body, 'req.body');
    res.send(req.body);
});
```