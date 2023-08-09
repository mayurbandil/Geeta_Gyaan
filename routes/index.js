// this file will contain all the root level routes manje jo bhi request hogi browser ki taraf se voh isse hoke jaegi 

const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use("/posts", require("./posts"));
router.use('/comments', require('./comments'));

module.exports = router;