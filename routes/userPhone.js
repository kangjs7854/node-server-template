/*
 * @Date: 2020-07-29 17:58:01
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-31 14:13:58
 * @FilePath: \server\routes\userPhone.js
 */
//小程序手机号授权获得加密字段后解密

const WXBizDataCrypt = require('../public/javascripts/WXBizDataCrypt')
const appId = 'wx4f4bc4dec97d474b'
const sessionKey = 'tiihtNczf5v6AKRyjwEUhQ=='
const pc = new WXBizDataCrypt(appId, sessionKey)

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
    const { encryptedData, iv } = req.body
    const data = pc.decryptData(encryptedData, iv)
    const userPhone = new userPhoneModel(data)
    userPhone.save((err, saved) => res.json(saved))
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