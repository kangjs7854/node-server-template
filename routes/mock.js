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
let mockModel,mockController

const allMockModel = new quicklyMockModel('AllMockApi',{
   method:String,
   apiName:String,
   dataSource:[
      {
         id:String,
         key:String,
         value:String,
         unique:Boolean,
         type:{
            type:String
         },
         children:[{
            id:String,
            key:String,
            value:String,
            type:{
               type:String
            },
            isInner:Boolean
         }],
         test:String
      }
   ],
})

const allMockController = new Controller(allMockModel.Model)
//查找
router.get('/mock', async (req, res, next) => {
   const { apiName } = req.query
   const mock = await allMockController.find({ apiName })
   res.json(mock)
})


router.get("/mock:id",async(req,res)=>{
   const {url} = req.body
   if(!url) return 
   const query = {url}
   const payload = { ...req.body } //内容
   const data = await mockController.insert(query, payload)
   res.json({data})
})

//增加 || 更新
router.post('/mock/:id', async (req, res, next) => {
   const {newData,deleteId,deletedKeyValue} = req.body
   const apiName = req.body.apiName || req.params.id
   let resData//响应结果
   if(!apiName) return
   //只记住第一次传入时的数据模型,查找mock过的api的记录
   const mockApiRecord = await allMockController.find({apiName})
   //表格数据
   const dataSource = req.body.dataSource || mockApiRecord.dataSource || []
   if(!mockApiRecord){
      await allMockController.insert({apiName},{
         dataSource,
         method:'POST',
         apiName
      })
   }

   const {mockController,query,payload} = handleDataSource(dataSource,apiName)

   if(deleteId){
      resData = await mockController.remove({_id:deleteId})
   } else if(newData && newData._id){
      resData = Object.keys(deletedKeyValue).length
                  ? await mockController.update({_id:newData._id},{$unset: deletedKeyValue})
                  : await mockController.update({_id:newData._id},newData)
   } else{
      resData = await mockController.insert(query, payload)

   }


   res.json({data:resData,code:0,msg:"请求成功"})

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

/**
 * @description 处理表格数据，生成数据模型以及控制器、查询条件、填充内容
 * @param dataSource 表格数据
 * @param apiName
 * @returns {{query: {}, payload:{}, mockController: Controller}} 查询条件、填充内容及控制器
 */
function handleDataSource(dataSource,apiName){
   let uniqueObj = {}//含有唯一标识的key的对象
   let query = {} //匹配条件,根据什么字段进行插入或者更新
   const Schema = {}//数据模式
   const payload = {} //数据内容
   const innerSchema = {}//嵌套对象时，该对象的数据模式
   const innerPayload = {}//嵌套对象时，该对象的数据内容
   //处理前端传过来的表格数据，转化成Schema和需要插入或更新的数据内容payload
   dataSource.forEach(el=>{
      if(el.unique){
         uniqueObj = el
         query = {[uniqueObj.key]:uniqueObj.value}
      }
      //处理对象的数据结构
      if(el.children && el.children.length){
         const innerDataSource =el.children
         innerDataSource.forEach(innerEl=>{
            innerSchema[innerEl.key] = innerEl.type
            innerPayload[innerEl.key] = innerEl.value
         })
         Schema[el.key] = innerSchema
         payload[el.key] = innerPayload
         return
      }
      Schema[el.key] = el.type
      payload[el.key] = el.value
   })
   //动态添加schema的字段和数据类型
   mockSchema.add(Schema)
   //再生成模型
   mockModel = mongoose.model(apiName,mockSchema)
   //传入该模型生成控制器
   mockController = new Controller(mockModel)
   return {
      mockController,
      query,
      payload
   }
}

module.exports = router;