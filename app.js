const express = require('express');
const app = express();
const router = express.Router();
const user = require('./router/user');
const home = require('./router/home');
app.use(express.json());

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});
app.use('/api/user', user);
app.use('/', home);
app.listen('3000', () => {
    console.log(' serve is running at http://localhost:3000/');
});
