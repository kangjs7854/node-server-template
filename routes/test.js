/*
 * @Date: 2020-07-31 11:52:40
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-31 14:04:17
 * @FilePath: \server\routes\test.js
 */
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();

const { testModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

//查找
router.get('/test', ((req, res, next) => {
    const { id } = req.query
    id ? testModel.findById(id).exec((err, test) => res.json(test))
        : testModel.find().exec((err, tests) => res.json(tests))
}))

//增加
router.post('/test', ((req, res, next) => {
    const test = new testModel(req.body)
    test.save((err, saved) => res.json(saved))
}))

//删除
router.delete('/test', ((req, res, next) => {
    const { id } = req.body
    testModel.findByIdAndRemove(id,(err, removed) => res.json(removed))
}))

//修改
router.put('/test', ((req, res, next) => {
    const { id } = req.body
    testModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;