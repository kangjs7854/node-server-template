/*
 * @Date: 2020-07-31 11:52:40
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-17 11:50:21
 * @FilePath: \server\api\test.js
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性

const { quicklyMockModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来
const Controller = require('../controllers/index');
//快速mock数据，生成数据模型
const test = new quicklyMockModel('test',{
    name:String,
    age:Number
})
//传入该模型生成控制器
const testController = new Controller(test.Model)

//查找
router.get('/test', async(req, res, next) => {
   const { id } = req.query
   const test = await testController.find({ _id: id })
   res.json(test)
})

//增加 || 更新
router.post('/test', async(req,res,next) => {
   const { id, name } = req.body
   const query = { name } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
   const payload = { ...req.body } //内容

   const data = await testController.insert(query, payload)
   res.json(data)
})

//删除
router.delete('/test', async(req,res,next) => {
   const { id } = req.body
   const data = await testController.remove(id)
   res.json(data)
})

//修改
router.put('/test', async(req,res,next) => {
   const { id } = req.body
  const data = await testController.update({ _id: id }, { ...req.body })
   res.json(data)
})

module.exports = router;