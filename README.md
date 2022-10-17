# learn-api


## 加密方式
- bcrypt


## 如何生成token
- jsonwebtoken

```js
const jwt = require('jsonwebtoken')
// 
const token = jwt.sign({
  id: '',
}, '密钥') // ID, 密钥唯一值 可定义在env中
```

如何使用token
```js

```


## 实现用户的注册登陆

实现注册接口
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
