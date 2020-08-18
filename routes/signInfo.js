/*
 * @Date: 2020-08-18 18:00:15
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-18 18:34:40
 * @FilePath: \server\routes\signInfo.js
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性

const { quicklyMockModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来
const Controller = require('../controllers/index');
//快速mock数据，生成数据模型
const signInfo = new quicklyMockModel('signInfo', {
    queueNo: String,
    waitingNum: Number,
    queueMsg: String,
    navigationType: Number,
    navigationUrl: String,
    orderNo: {
        type: ObjectId,
        ref: "OrderList"
    },
    signStatus:String
})
//传入该模型生成控制器
const signInfoController = new Controller(signInfo.Model)

//查找
router.get('/signInfo', async (req, res, next) => {
    const { id } = req.query
    const signInfo = await signInfoController.find({ _id: id })
    res.json(signInfo)
})

//增加 || 更新
router.post('/signInfo', async (req, res, next) => {
    const { orderId } = req.body
    const query = { orderNo: orderId } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
    const payload = { ...req.body } //内容

    const data = await signInfoController.insert(query, payload)
    res.json({ data: data[0] })
})

//删除
router.delete('/signInfo', async (req, res, next) => {
    const { id } = req.body
    const data = await signInfoController.remove(id)
    res.json(data)
})

//修改
router.put('/signInfo', async (req, res, next) => {
    const { id } = req.body
    const data = await signInfoController.update({ _id: id }, { ...req.body })
    res.json(data)
})

module.exports = router;