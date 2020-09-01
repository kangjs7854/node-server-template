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

const allMockModel = new quicklyMockModel('AllMockApi',{
   method:String,
   apiName:String,
   dataSource:[
      {
         key:String,
         value:String,
         unique:Boolean,
         type:{
            type:String
         }
      }
   ],
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
   const {dataSource,apiName} = req.body
   const uniqueObj = dataSource.find(el=>el.unique == true)
   const query = { [uniqueObj.key]:uniqueObj.value } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
   const payload = {} //内容
   const Schema = {}
   dataSource.forEach(el=>{
      Schema[el.key] = el.type
      payload[el.key] = el.value
   })
   //动态添加schema的字段和数据类型
   mockSchema.add(Schema)
   //再生成模型
   const mockModel = mongoose.model('MockApi',mockSchema)
   //传入该模型生成控制器
   const mockController = new Controller(mockModel)
   const data = await mockController.insert(query, payload)

   try{
      await allMockController.insert({apiName},{
         dataSource,
         method:'POST',
         apiName
      })
   }catch(err){
      console.log(err);
   }
   res.json({data})

})

//删除
router.delete('/mock', async (req, res, next) => {
   const { apiName } = req.body
   const data = await allMockController.remove({apiName})
   res.json(data)
})

//修改
router.put('/mock', async (req, res, next) => {
   const { id } = req.body
   const data = await mockController.update({ _id: id }, { ...req.body })
   res.json(data)
})

module.exports = router;