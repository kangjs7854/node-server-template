const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性

const { quicklyMockModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来
const Controller = require('../controllers/index');
//快速mock数据，生成数据模型
const mock = new quicklyMockModel('mock',{
    name:String,
    age:Number
})
//传入该模型生成控制器
const mockController = new Controller(mock.Model)

//查找
router.get('/mock', async(req, res, next) => {
   const { id } = req.query
   const mock = await mockController.find({ _id: id })
   res.json(mock)
})

//增加 || 更新
router.post('/mock', async(req,res,next) => {
   const { id, name } = req.body
   const query = { name } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
   const payload = { ...req.body } //内容

   const data = await mockController.insert(query, payload)
   res.json(data)
})

//删除
router.delete('/mock', async(req,res,next) => {
   const { id } = req.body
   const data = await mockController.remove(id)
   res.json(data)
})

//修改
router.put('/mock', async(req,res,next) => {
   const { id } = req.body
  const data = await mockController.update({ _id: id }, { ...req.body })
   res.json(data)
})

module.exports = router;