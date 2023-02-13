const express = require('express');
const app = express();
const router = express.Router();
const user = require('./router/user');
const home = require('./router/home');
const upload = require('./router/upload');
const logger = require('./logger');
app.use(express.json());

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
app.use('/api/user', user);
app.use('/api/', upload);
app.use('/', home);


app.listen('3000', () => {
    console.log(' serve is running at http://localhost:3000/');
    logger.info(' serve is restart')
});
