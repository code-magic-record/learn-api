const fs = require('fs');
const path = require('path');
const express = require('express');
const dayjs = require('dayjs');
const router = express.Router();
const Multiparty = require('multiparty');
const cos = require('./config');
const dotenv = require('dotenv');
const { connection } = require('../../db/mysql');
dotenv.config();
const { BUCKET, REGION } = process.env;

function getFileInfo(req, cb) {
    const form = new Multiparty.Form();
    form.parse(req, function (err, fields, files) {
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
    connection.query(
        sql,
        { category_name, category_logo, create_time: now, update_time: now },
        (err, data) => {
            if (!err) {
                return res.send({
                    code: 200,
                    data: '创建成功！',
                });
            }
            return res.send({
                code: err,
            });
        }
    );
});

/**
 * 获取分类列表
 */

router.get('/get_category_list', (req, res) => {
    const sql = `select * from image_category`;
    connection.query(sql, (err, data) => {
        if (!err) {
            return res.send({
                code: 200,
                data,
            });
        }
        return res.send({
            code: err,
        });
    });
});

const formatData = (list) => {
    const fileList = list.map((item) => {
        let extname = path.extname(item.originalFilename);
        return {
            key: item.path.split('/').slice(-1)[0],
            name: item.originalFilename.replace(extname, ''),
            localPath: item.path,
            extname,
            size: item.size,
        };
    });
    return fileList;
};
/**
 * 上传图片
 */
router.post('/upload', (req, res) => {
    getFileInfo(req, (err, fields, files) => {
        let errInfo = err;
        let fileList = files.file;
        fileList = formatData(fileList);
        fileList.forEach((item) => {
            const { path, originalFilename } = item;
            cos.putObject({
                Bucket: BUCKET,
                Region: REGION,
                Key: item.key,
                StorageClass: 'STANDARD',
                Body: fs.createReadStream(item.localPath), // 上传文件对象
            });
            const sql = 'insert into image set ?';
            const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
            const values = {
                img_size: item.size,
                img_name: item.name,
                img_type: item.extname,
                img_key: item.key,
                create_time: now,
                catetory_id: 7,
            };
            connection.query(sql, values, (err, data) => {
              console.log(err)
              errInfo = err;
            });
        });
        if (!errInfo) {
            return res.send({
                code: 200,
                data: fileList,
                msg: '上传成功',
            });
        }
        return res.send({
            code: 500,
            msg: errInfo,
        });
    });
});


/**
 * 获取图片列表
 */

router.get('/get_image_list', (req, res) => {
    const sql = `select * from image`;
    connection.query(sql, (err, data) => {
        if (!err) {
            return res.send({
                code: 200,
                data,
            });
        }
        return res.send({
            code: err,
        });
    })
})
module.exports = router;
