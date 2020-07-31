/*
 * @Date: 2020-07-30 18:44:10
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-31 14:13:15
 * @FilePath: \server\routes\appointmentOrder.js
 */ 
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();

const { appointmentOrderModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

//查找
router.get('/appointmentOrder',((req,res,next) => {
   const { id } = req.query
   id ? appointmentOrderModel.findById(id).exec((err,appointmentOrder)=>res.json(appointmentOrder))
   :appointmentOrderModel.find().exec((err,appointmentOrders)=>res.json(appointmentOrders))
}))

//增加
router.post('/appointmentOrder',((req,res,next) => {
   const appointmentOrder = new appointmentOrderModel(req.body)
   appointmentOrder.save((err,saved)=>res.json(saved))
}))

//删除
router.delete('/appointmentOrder',((req,res,next) => {
   const {id} = req.body
   appointmentOrderModel.findByIdAndRemove(id,(err,removed)=>res.json(removed))
}))

//修改
router.put('/appointmentOrder',((req,res,next) => {
   const {id} = req.body
   appointmentOrderModel.findByIdAndUpdate(id,{...req.body},{new:true},(err,updated)=>res.json(updated))
}))

module.exports = router;