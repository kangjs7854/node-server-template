/*
 * @Date: 2020-07-29 14:34:55
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-31 11:14:49
 * @FilePath: \server\routes\userInfo.js
 */
const express = require('express');
const axios = require("axios")
const router = express.Router();

const { User } = require("../model/index")

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
        // Object.assign(res2.data,{
        //     token:''
        // })
        res.json(res2.data)
    })
});


router.get("/user_info", (req, res) => {
    const { user_id } = req.query
    if (!user_id) {
        User.find((err, allUser) => {
            res.json(allUser)
        })
        return
    }
    User.findOne({ _id: user_id })
        .exec((err, user) => {
            if (err) return console.log(err)
            res.json(user)
        })
})


router.post("/user_info", (req, res) => {
    const newUser = new User(req.body)
    newUser.save((err, saved) => {
        res.json(saved)
    })
})

router.delete('/user_info', ((req, res) => {
    const { user_id } = req.body
    User.findByIdAndRemove({ _id: user_id })
        .exec(err => {
            User.find((err, restUser) => {
                res.json(restUser)
            })
        })
}))

module.exports = router;