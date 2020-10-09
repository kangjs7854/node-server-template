/*
 * @Date: 2020-08-07 10:24:52
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-11 09:37:27
 * @FilePath: \server\routes\memberInfo.js
 */
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();

const { memberInfoModel, cardModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

//查找
router.get('/memberInfo', ((req, res, next) => {
   const { id } = req.query
   id ? memberInfoModel.findById(id).populate('cardInfo').exec((err, memberInfo) => res.json(memberInfo))
      : memberInfoModel.find().populate('cardInfo').exec((err, memberInfos) => res.json(memberInfos))
}))

//增加
router.post('/memberInfo', ((req, res, next) => {
   const { cardNo, memberName, memberSex } = req.body
   if(!cardNo && memberName){
      memberInfoModel.findOneAndUpdate(
         {memberName}, 
         {...req.body}, 
         {upsert:true,new: true}).exec((err,data)=>res.json(data))
   }
   else if (cardNo && memberName) {
      const newCard = new cardModel({
         cardNo,
         cardType: "就诊卡",
         cardName: "医保电脑"
      })
      newCard.save((err, saved) => {
         if (err) console.log(err);
         memberInfoModel.findOneAndUpdate(
            { memberName },
            {
               memberName,
               memberSex,
               cardInfo: saved._id
            },
            {
               upsert: true,
               new: true,
               setDefaultsOnInsert: true
            }).populate('cardInfo').exec((err,memberInfo)=>{
              const obj = {
                  returnCode: 200,
                  returnMsg: "成功",
                  data: {
                     memberInfo,
                     timestamp: new Date().getTime(),
                     extendData: {
                         data: '扩展字段'
                     },
                  },
              }
              res.json(obj)
            })
      })
   } else {
      memberInfoModel.find().populate('cardInfo').exec((err, memberInfos) => {
         const obj = {
                  returnCode: 200,
                  returnMsg: "成功",
                  data: {
                     memberInfoList:memberInfos,
                     timestamp: new Date().getTime(),
                     extendData: {
                         data: '扩展字段'
                     },
                     limitMember:12
                  },
              }
              res.json(obj)
      })
   }
}))

//删除
router.delete('/memberInfo', ((req, res, next) => {
   const { id } = req.body
   memberInfoModel.findByIdAndRemove(id, (err, removed) => res.json(removed))
}))

//修改
router.put('/memberInfo', ((req, res, next) => {
   const { id } = req.body
   memberInfoModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;