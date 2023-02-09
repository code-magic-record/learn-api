const fs = require('fs')
const express = require('express')
const router = express.Router()
const Multiparty = require('multiparty');
const cos = require('./config')
const dotenv = require("dotenv");
dotenv.config();
const {BUCKET, REGION} = process.env;

function getFileInfo(req, cb) {
  const form = new Multiparty.Form({path: '/'});
  form.parse(req, function(err, fields, files) {
    cb(err, fields, files);
  });
}

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