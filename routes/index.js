/*
 * @Date: 2020-08-14 09:46:53
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-14 10:14:04
 * @FilePath: \server\routes\index.js
 */
const express = require('express');
const router = express.Router();


//查找
router.get('/', async (req, res, next) => {
   res.render('index', { title: "express" })
})



module.exports = router;