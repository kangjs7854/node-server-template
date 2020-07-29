/*
 * @Date: 2020-07-29 17:58:01
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-29 18:09:33
 * @FilePath: \server\routes\getUserPhone.js
 */
//小程序手机号授权获得加密字段后解密
const express = require('express');
const axios = require('axios')
const WXBizDataCrypt = require('../public/javascripts/WXBizDataCrypt')
const router = express.Router();

router.get('/',(req,res => {
   res.json()
}))

module.exports = router;