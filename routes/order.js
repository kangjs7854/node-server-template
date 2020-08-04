/*
 * @Date: 2020-08-04 18:26:45
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-04 18:44:17
 * @FilePath: \server\routes\order.js
 */
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();

const { orderModel, userModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

//查找
router.get('/order', ((req, res, next) => {
    const { id } = req.query
    orderModel.findId(id).populate('buyer').exec((err,allOrder)=>res.json(allOrder))
    // userModel.find({username}).populate('buyer').exec((err, orders) => res.json(orders))
}))

//增加
router.post('/order', ((req, res, next) => {
    const { username, price } = req.body
    if(username){
        const newUser = new userModel({username})
        newUser.save((err,saved)=>{
            const newOrder = new orderModel({
                price,
                buyer:saved._id
            })
            newOrder.save((err,saved)=>res.json(saved))
        })
    }
}))

//删除
router.delete('/order', ((req, res, next) => {
    const { id } = req.body
    orderModel.findByIdAndRemove(id, (err, removed) => res.json(removed))
}))

//修改
router.put('/order', ((req, res, next) => {
    const { id } = req.body
    orderModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;