/*
 * @Date: 2020-07-29 14:34:55
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-30 15:31:11
 * @FilePath: \server\routes\getUserInfo.js
 */
const express = require('express');
const axios = require("axios")
const router = express.Router();

const { User, Patient, AppointmentOrder, AppointmentStep } = require("../model/index")

//小程序登录凭证校验
router.post('/wx', function(req, res, next) {
    const JSCODE = req.body.code//小程序端传过来的code
    const reg = /wx[0-9a-zA-Z]+/g
    const APPID = req.headers.referer.match(reg)[0]//小程序appid
    const SECRET = 'd04278b039af677516f7f5d01670e62e'//小程序密钥
    axios.get('https://api.weixin.qq.com/sns/jscode2session',{
        params:{
            appid:APPID,
            secret:SECRET,
            js_code:JSCODE,
            grant_type:"authorization_code" 
        }
    }).then(res2=>{
        // Object.assign(res2.data,{
        //     token:''
        // })
        res.json(res2.data)
    })
});

router.get('/', (req, res, next) => {
    User.find((err, allUser) => {
        res.json(allUser)
    })
})

router.post("/", (req, res) => {
    const newUser = new User(req.body)
    newUser.save((err,saved)=>{
        res.json(saved)
    })
})

module.exports = router;