/*
 * @Date: 2020-07-29 14:34:55
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-29 18:18:15
 * @FilePath: \server\routes\getUserInfo.js
 */ 
const express = require('express');
const axios = require("axios")
const router = express.Router();

//小程序登录凭证校验
router.post('/', function(req, res, next) {
    const JSCODE = req.body.code//小程序端传过来的code
    const reg = /wx[0-9a-zA-Z]+/g
    const APPID = req.headers.referer.match(reg)[0]//小程序appid
    const SECRET = ''//小程序密钥
    axios.get('https://api.weixin.qq.com/sns/jscode2session',{
        params:{
            appid:APPID,
            secret:SECRET,
            js_code:JSCODE,
            grant_type:"authorization_code" 
        }
    }).then(res2=>{
        Object.assign(res2.data,{
            token:''
        })
        res.json(res2.data)
    })
});

module.exports = router;