/*
 * @Date: 2020-08-18 10:33:27
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-20 18:37:40
 * @FilePath: \server\routes\mock.js
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性

const Controller = require('../controllers/index');

const mockSchema = mongoose.Schema()
//查找
router.get('/mock', async (req, res, next) => {
   const { id } = req.query
   const mock = await mockController.find({ _id: id })
   res.json(mock)
})

//增加 || 更新
router.post('/mock/:id', async (req, res, next) => {
   const { id, name ,Schema} = req.body
   const query = { name } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
   const payload = { ...req.body } //内容
   const modelName = req.originalUrl.slice(10)
   //动态添加schema的字段和数据类型
   mockSchema.add(Schema)
   //再生成模型
   const mockModel = mongoose.model(modelName,mockSchema)
   //传入该模型生成控制器
   const mockController = new Controller(mockModel)
   const data = await mockController.insert(query, payload)
   res.json({data})
})

//删除
router.delete('/mock', async (req, res, next) => {
   const { id } = req.body
   const data = await mockController.remove(id)
   res.json(data)
})

//修改
router.put('/mock', async (req, res, next) => {
   const { id } = req.body
   const data = await mockController.update({ _id: id }, { ...req.body })
   res.json(data)
})

module.exports = router;