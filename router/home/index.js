const express = require('express');
const router = express.Router();

// 获取用户信息
router.get('/', async (req, res) => {
    const html = `
        <div>
            <h1>数据库服务</h1>
        </div>
    `
    res.send(html);
});

module.exports = router;