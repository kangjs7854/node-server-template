/*
 * @Date: 2020-08-18 10:33:27
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-21 15:47:49
 * @FilePath: \server\routes\mock.js
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性

const {quicklyMockModel} = require("../model/index")
const Controller = require('../controllers/index');

const mockSchema = mongoose.Schema()

const allMockModel = new quicklyMockModel('allMock',{
   methods:String,
   url:String,
   dataSource:{
      key:String,
      schemaType:String,
      schemaKey:String,
      schemaValue:String
   },
})

const allMockController = new Controller(allMockModel.Model)
//查找
router.get('/mock', async (req, res, next) => {
   const { id } = req.query
   const mock = await allMockController.find({ _id: id })
   res.json(mock)
})


router.post("/mock",async(req,res)=>{
   const {url} = req.body
   if(!url) return 
   const query = {url}
   const payload = { ...req.body } //内容
   const data = await allMockController.insert(query, payload)
   res.json({data})
})

//增加 || 更新
router.post('/mock/:id', async (req, res, next) => {
   const { id, name ,Schema,uniqueKey} = req.body
   const query = { [uniqueKey]:req.body[uniqueKey] } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
   const payload = { ...req.body } //内容
   const modelName = req.originalUrl.slice(10)
   //动态添加schema的字段和数据类型
   mockSchema.add(Schema)
   //再生成模型
   const mockModel = mongoose.model(modelName,mockSchema)
   //传入该模型生成控制器
   const mockController = new Controller(mockModel)
   const data = await mockController.insert(query, payload)


   let dataSource = []
   for(let i in Schema){
      dataSource.push({
         schemaKey:i,
         schemaType:Schema[i],
         schemaValue:req.body[i]
      })
   }
   dataSource = dataSource.map((el,index)=> Object.assign(el,{key:index+''}))
   const all = await allMockController.insert({url:modelName},{
      dataSource,
      methods:'POST',
      url:modelName
   })
   res.json({data})
})

//删除
router.delete('/mock', async (req, res, next) => {
   const { url } = req.body
   const data = await allMockController.remove({url})
   res.json(data)
})

//修改
router.put('/mock', async (req, res, next) => {
   const { id } = req.body
   const data = await mockController.update({ _id: id }, { ...req.body })
   res.json(data)
})

module.exports = router;