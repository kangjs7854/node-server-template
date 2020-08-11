/*
 * @Date: 2020-08-11 09:41:34
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-11 14:44:39
 * @FilePath: \server\routes\orderList.js
 */
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();

const { orderListModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来
const { insertOrUpDate } = require("../controllers/index")

//查找
router.get('/orderList', ((req, res, next) => {
    const { id } = req.query
    id ? orderListModel.findById(id).exec((err, orderList) => res.json(orderList))
        : orderListModel.find().exec((err, orderLists) => res.json(orderLists))
}))

//增加
router.post('/orderList', ((req, res, next) => {
    const { memberId, orderId } = req.body
    Object.assign(req.body, {
        userName: memberId
    })

    insertOrUpDate(orderListModel, { _id: orderId }, req.body, ['userName', 'memberName'], 'orderList')
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.send(err)
        })

}))

//删除
router.delete('/orderList', ((req, res, next) => {
    const { id } = req.body
    orderListModel.findByIdAndRemove(id, (err, removed) => res.json(removed))
}))

//修改
router.put('/orderList', ((req, res, next) => {
    const { id } = req.body
    orderListModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;



