const fs = require('fs')
const express = require('express')
const dayjs = require('dayjs')
const router = express.Router()
const Multiparty = require('multiparty');
const cos = require('./config')
const dotenv = require("dotenv");
const { connection } = require('../../db/mysql');
dotenv.config();
const {BUCKET, REGION} = process.env;

function getFileInfo(req, cb) {
  const form = new Multiparty.Form({path: '/'});
  form.parse(req, function(err, fields, files) {
    cb(err, fields, files);
  });
}


/**
 * 创建分类
 */
router.post('/create_category', (req, res) => {
  const { category_name, category_logo } = req.body;
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const sql = `insert into image_category set ?`;
  connection.query(sql, { category_name, category_logo, create_time: now, update_time: now }, (err, data) => {
    if (!err) {
      return res.send({
        code: 200,
        data: '创建成功！'
      })
    }
    return res.send({
      code: err,
    })
  })
})

/**
 * 获取分类列表
 */

router.get('/get_category_list', (req, res) => {
  const sql = `select * from image_category`;
  connection.query(sql, (err, data) => {
    if (!err) {
      return res.send({
        code: 200,
        data
      })
    }
    return res.send({
      code: err,
    })
  })
})



router.post('/upload', (req, res) => {
  getFileInfo(req, (err, fields, files) => {
    const fileList = files.file;
    fileList.forEach( async (item) => {
      const  { path, originalFilename } = item;
      const key = path.split('/').slice(-1)[0];
      cos.putObject({
        Bucket: BUCKET,
        Region: REGION,
        Key: key,
        StorageClass: 'STANDARD',
        Body: fs.createReadStream(path), // 上传文件对象
      });
    })
    // ok
    if (!err) {
      return res.send({
        code: 200,
        data: '上传成功！'
      })
    }
    return res.send({
      code: 500,
    })
  })
})
module.exports = router