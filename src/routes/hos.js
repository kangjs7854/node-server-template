/*
 * @Date: 2020-08-06 17:14:44
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-06 18:20:25
 * @FilePath: \server\routes\hos.js
 */
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();
const fs = require("fs")

const { hosModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

//查找
router.get('/hos', ((req, res, next) => {
    const { id } = req.query
    id ? hosModel.findById(id).exec((err, hos) => res.json(hos))
        : hosModel.find().exec((err, hoss) => res.json(hoss))
}))

//增加
router.post('/hos', ((req, res, next) => {
    const { id } = req.body
    if (id) {
        hosModel.findById(id).exec((err, hos) => {
            Object.assign(hos, {
                unitId: 263,
                timestamp: new Date().getTime(),
                extendData: {
                    data: '扩展字段'
                },
            })
            const obj = {
                returnCode: 200,
                returnMsg: "成功",
                data: hos,
            }

            res.json(obj)
        })
        return
    }
    const hos = new hosModel(req.body)
    hos.save((err, saved) => res.json(saved))
}))

//删除
router.delete('/hos', ((req, res, next) => {
    const { id } = req.body
    console.log(id);
    hosModel.findByIdAndRemove(id, (err, removed) => res.json(removed))
}))

//修改
router.put('/hos', ((req, res, next) => {
    const { id } = req.body
    const imgUrl = fs.readFileSync('E:/kjs/server/public/images/a1_bg_wu@2x.png')
    const unitImg = imgUrl.toString('base64')
    hosModel.findByIdAndUpdate(id, { ...req.body, unitImg }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;