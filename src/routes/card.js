/*
 * @Date: 2020-08-07 10:30:41
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-07 15:01:01
 * @FilePath: \server\routes\card.js
 */
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();

const { cardModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

//查找
router.get('/card', ((req, res, next) => {
   const { id } = req.query
   id ? cardModel.findById(id).exec((err, card) => res.json(card))
      : cardModel.find().exec((err, cards) => res.json(cards))
}))

//增加
router.post('/card', ((req, res, next) => {
   const { unitId } = req.body
   if (unitId) {
      res.json({
         returnCode: 200,
         returnMsg: "成功",
         data: {
            buildCardUrl:"buildCard/create",
            timestamp: new Date().getTime(),
            extendData: {
               data: '扩展字段'
            },
         },
      })
      return
   }
   const card = new cardModel(req.body)
   card.save((err, saved) => res.json(saved))
}))

//删除
router.delete('/card', ((req, res, next) => {
   const { id } = req.body
   cardModel.findByIdAndRemove(id, (err, removed) => res.json(removed))
}))

//修改
router.put('/card', ((req, res, next) => {
   const { id } = req.body
   cardModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;