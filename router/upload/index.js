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

function getFileInfo(req) {
    const form = new Multiparty.Form();
    return new Promise((resolve, reject) => {
        form.parse(req, function (err, fields, files) {
            if (err) {
                reject({ err });
            } else {
                resolve({
                    fields,
                    files,
                });
            }
        });
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
                    category_id: data.insertId,
                });
            }
            return res.send({
                code: 400,
                data: err,
                msg: '创建失败！',
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
router.post('/upload', async (req, res) => {
    const { err, files } = await getFileInfo(req);
    if (err) res.send({ code: 500, msg: '系统错误' });
    let fileList = files.file;
    fileList = formatData(fileList);
    fileList.forEach(async (item) => {
        const { path, originalFilename } = item;
        await cos.putObject({
            Bucket: BUCKET,
            Region: REGION,
            Key: item.key,
            StorageClass: 'STANDARD',
            Body: fs.createReadStream(item.localPath), // 上传文件对象
        });
    });
    res.send({
        code: 200,
        msg: '上传成功',
        data: fileList.map((item) => ({
            key: item.key,
            name: item.name,
            extname: item.extname,
            size: item.size,
        })),
    });
});

router.post('/add_image', async (req, res) => {
    const { image_list, catetory_id } = req.body;
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const sql = `insert into image(img_size, img_name, img_type, img_key, catetory_id, create_time) values ?`;
    // 参数校验--- TODO
    const valuesList = image_list.map((item) => {
        return [
            item.size,
            item.name,
            item.extname,
            item.key,
            catetory_id,
            now,
        ];
    });
    connection.query(sql, [valuesList], (err, data) => {
        if (!err) {
            return res.send({
                code: 200,
                data: '添加成功！',
            });
        }
        return res.send({
            code: 400,
            data: err,
            msg: '添加失败！',
        });
    });
    // valuesList.forEach((item) => {
    //     connection.query(sql, item, (err, data) => {});
    // })
    // //
    // res.send({
    //     code: 200,
    //     msg: '添加成功',
    // })

});

/**
 * 获取图片列表
 */
router.get('/get_image_list', (req, res) => {
    const { category_id } = req.query;
    const sql = `select * from image where catetory_id = ${category_id}`;
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
module.exports = router;
