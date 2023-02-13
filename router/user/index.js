const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const saltRounds = 10
const tokenSalt = 'token_secret'
const { connection } = require('../../db/mysql')
const auth = require('../../middleware/auth')

router.post('/register', (req, res) => {
  const { userName, passWord } = req.body
  // 先查询用户是否存在，不存在则注册，否则提示用户已存在
  const sqlUser = 'select * from user where user_name= ?'
  connection.query(sqlUser, [userName], (_err, data) => {
    if (data.length !== 0) {
      res.send({
        code: 0,
        msg: '用户已存在'
      })
      return
    }
    bcrypt.hash(passWord, saltRounds, function (err, hash) {
      if (err) {
        console.log(err)
        return res.send({
          code: 0,
          msg: '服务器错误'
        })
      }
      // const sql = `insert into user(user_name, pass_word) values('${userName}', '${hash}')`;
      const sql = 'insert into user set ?'
      connection.query(sql, { user_name: userName, pass_word: passWord }, (err, data) => {
        if (!err) {
          res.send({
            code: 1,
            msg: '注册成功'
          })
          return
        }
        res.send({
          code: 500,
          msg: err
        })
      })
      console.log(hash)
    })
  })
})

// 用户登录
router.post('/login', (req, res) => {
  const { userName, passWord } = req.body
  // 验证密码是否正确
  const sql = 'select * from user where user_name= ?'
  connection.query(sql, [userName], (err, data) => {
    if (!err) {
      if (data.length > 0) {
        const passWordHash = data[0].pass_word
        const id = data[0].id
        bcrypt.compare(passWord, passWordHash, (_err, isTrue) => {
          const token = jwt.sign({ id }, tokenSalt)
          console.log(token, 'token')
          if (isTrue) {
            res.send({
              code: 1,
              msg: '登录成功',
              token
            })
            return
          }
          res.send({
            code: 0,
            msg: '密码不正确'
          })
        })
      } else {
        res.send({
          code: 0,
          msg: '用户不存在'
        })
      }
    }
  })
})

// 获取用户信息
router.get('/profile', auth, async (req, res) => {
  const { id, user_name } = req.user
  res.send({
    code: 1,
    msg: '获取用户信息成功',
    data: {
      id,
      userName: user_name
    }
  })
})

// 修改用户信息
router.post('/updateUser', auth, async (req, res) => {
  const { userName, id, email, phone } = req.body
  const sql = 'update user set user_name=?, email=?, phone=? where id=?'
  connection.query(sql, [userName, email, phone, id], (err, data) => {
    if (err) {
      res.send({
        code: 0,
        msg: '修改失败',
        e: err
      })
      return
    }
    res.send({
      code: 1,
      msg: '修改成功'
    })
  })
})

// 删除用户
router.post('/deleteUser', auth, async (req, res, user) => {
  const { id } = req.body
  const { is_super, id: userId } = req.user
  if (id === userId) {
    res.send({
      code: 0,
      msg: '无法删除自己'
    })
  }
  if (is_super) {
    res.send({
      code: 0,
      msg: '您没有权限删除用户'
    })
    return
  }

  const sql = 'delete from user where id=?'
  // 需要判断当前登录的用是否是超级管理员
  connection.query(sql, [id], (err, data) => {
    if (err) {
      res.send({
        code: 0,
        msg: '删除失败'
      })
      return
    }
    console.log(err, data)
    res.send({
      code: 1,
      msg: '删除成功'
    })
  })
})

// 获取用户列表
router.get('/list', auth, async (req, res) => {
  const sql = 'select * from user'
  connection.query(sql, (err, data) => {
    if (!err) {
      res.send({
        code: 1,
        msg: '获取用户列表成功',
        data: data.map((item) => ({
          userName: item.user_name,
          id: item.id,
          phone: item.phone,
          email: item.email
        }))
      })
      return
    }
    res.send({
      code: 0,
      msg: '获取用户列表失败'
    })
  })
})

module.exports = router
