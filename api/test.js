/*
 * @Date: 2020-07-31 11:52:40
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-14 11:52:40
 * @FilePath: \server\api\test.js
 */
const express = require('express');
const router = express.Router();

const { testModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来
const { find, insert, remove, update } = require('../controllers/index');

//查找
router.get('/test', async (req, res, next) => {
   const { id, url } = req.query
   res.json({...req.body})
   return
   const test = await find(testModel, { _id: id })
   res.json(test)
})

//增加 || 更新
router.post('/test', async (req, res, next) => {
   const { id, name } = req.body
   const query = { name } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
   const payload = { ...req.body } //内容

   const data = await insert(testModel, query, payload)
   res.json(data)
})

//删除
router.delete('/test', async (req, res, next) => {
   const { id } = req.body
   const data = await remove(testModel, id)
   res.json(data)
})

//修改
router.put('/test', async (req, res, next) => {
   const { id } = req.body
   const data = await update(testModel, { _id: id }, { ...req.body })
   res.json(data)
})

module.exports = router;