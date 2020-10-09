/*
 * @Date: 2020-07-29 18:36:52
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-31 14:12:42
 * @FilePath: \server\routes\clinicGuide.js
 */
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();

const { clinicGuideModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

//查找
router.get('/clinicGuide',((req,res,next) => {
   const { id } = req.query
   id ? clinicGuideModel.findById(id).exec((err,clinicGuide)=>res.json(clinicGuide))
   :clinicGuideModel.find().exec((err,clinicGuides)=>res.json(clinicGuides))
}))

//增加
router.post('/clinicGuide',((req,res,next) => {
   const clinicGuide = new clinicGuideModel(req.body)
   clinicGuide.save((err,saved)=>res.json(saved))
}))

//删除
router.delete('/clinicGuide',((req,res,next) => {
   const {id} = req.body
   clinicGuideModel.findByIdAndRemove(id,(err,removed)=>res.json(removed))
}))

//修改
router.put('/clinicGuide',((req,res,next) => {
   const {id} = req.body
   clinicGuideModel.findByIdAndUpdate(id,{...req.body},{new:true},(err,updated)=>res.json(updated))
}))

module.exports = router;