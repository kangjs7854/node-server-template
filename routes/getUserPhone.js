/*
 * @Date: 2020-07-29 17:58:01
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-29 18:39:33
 * @FilePath: \server\routes\getUserPhone.js
 */
//小程序手机号授权获得加密字段后解密
const express = require('express');
const WXBizDataCrypt = require('../public/javascripts/WXBizDataCrypt')
const router = express.Router();

const appId = 'wx4f4bc4dec97d474b'
const sessionKey = 'tiihtNczf5v6AKRyjwEUhQ=='
const pc = new WXBizDataCrypt(appId, sessionKey)

router.post('/',((req,res) => {
    const {encryptedData,iv} = req.body
    const data = pc.decryptData(encryptedData , iv)
    res.json(data)
}))

module.exports = router;