/*
 * @Date: 2020-07-29 14:34:55
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-13 14:51:29
 * @FilePath: \server\routes\userInfo.js
 */
const express = require('express');
const axios = require("axios")
const router = express.Router();

const { userInfoModel } = require("../model/index")

//小程序登录凭证校验
router.post('/wx', function (req, res, next) {
    const JSCODE = req.body.code//小程序端传过来的code
    const reg = /wx[0-9a-zA-Z]+/g
    const APPID = req.headers.referer.match(reg)[0]//小程序appid
    const SECRET = 'd04278b039af677516f7f5d01670e62e'//小程序密钥
    axios.get('https://api.weixin.qq.com/sns/jscode2session', {
        params: {
            appid: APPID,
            secret: SECRET,
            js_code: JSCODE,
            grant_type: "authorization_code"
        }
    }).then(res2 => {
        Object.assign(res2.data, {
            timestamp: new Date().getTime(),
            extendData: {
                data: '扩展字段'
            },
        })
        const obj = {
            returnCode: 200,
            returnMsg: "成功",
            data: res2.data,
        }
        res.json(obj)
    })
});


router.get("/user_info", (req, res) => {
    const { id } = req.query
    id ? userInfoModel.findById(id).exec((err, userInfo) => res.json(userInfo))
        : userInfoModel.find().exec((err, userInfos) => res.json(userInfos))
})

router.post("/user_info", (req, res) => {
    const { id } = req.body 
    if(id){
        userInfoModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => {
            Object.assign(updated, {
                loginToken:'',
                timestamp: new Date().getTime(),
                extendData: {
                    data: '扩展字段'
                },
            })
            const obj = {
                returnCode: 200,
                returnMsg: "成功",
                data: updated,
            }

            res.json(obj)
        })
        return
    }
    const newUser = new userInfoModel(req.body)
    newUser.save((err, saved) => res.json(saved))
})

router.delete('/user_info', ((req, res) => {
    const { id } = req.body
    userInfoModel.findByIdAndRemove(id, (err, removed) => res.json(removed))
}))

router.put('/user_info', ((req, res, next) => {
    const { id } = req.body
    userInfoModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;

