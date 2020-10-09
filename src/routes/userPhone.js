/*
 * @Date: 2020-07-29 17:58:01
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-13 15:46:28
 * @FilePath: \server\routes\userPhone.js
 */
//小程序手机号授权获得加密字段后解密

// const WXBizDataCrypt = require('../public/javascripts/WXBizDataCrypt')


const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();

const { userPhoneModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

//查找
router.get('/userPhone', ((req, res, next) => {
    const { id } = req.query
    id ? userPhoneModel.findById(id).exec((err, userPhone) => res.json(userPhone))
        : userPhoneModel.find().exec((err, userPhones) => res.json(userPhones))
}))

//增加
router.post('/userPhone', ((req, res, next) => {
    const { encryptedData, iv ,session_key} = req.body
    const reg = /wx[0-9a-zA-Z]+/g
    const appId = req.headers.referer.match(reg)[0]
    if(appId && session_key){
        // const pc = new WXBizDataCrypt(appId, session_key)
        const data = pc.decryptData(encryptedData, iv)
        // const userPhone = new userPhoneModel(data)
        res.json(data)
        // userPhone.save((err, saved) => res.json(saved))
    }
}))

//删除
router.delete('/userPhone', ((req, res, next) => {
    const { id } = req.body
    userPhoneModel.findByIdAndRemove(id, (err, removed) => res.json(removed))
}))

//修改
router.put('/userPhone', ((req, res, next) => {
    const { id } = req.body
    userPhoneModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;