const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性

const testSchema = mongoose.Schema({
    name: String,
    age: Number
})

const  testModel = mongoose.model('test',  testSchema)


//查找
router.get('/test', async (req, res, next) => {
    const {id} = req.query
    let query = {}
    id && (query = {_id:id})
    const data = await testModel.find(query)
    res.json({data})
})

//增加 || 更新
router.post('/test', async (req, res, next) => {
    const {name} = req.body
    const query = {name} //检索条件
    const payload = {...req.body} //填充内容
    //如果文档中不存在该数据，插入，否则更新
    await testModel.findOneAndUpdate(query, payload,  {upsert: true,new:true}).exec()
    //返回所有的数据
    const data  = await testModel.find().exec()
    res.json(data)
})

//删除
router.delete('/test', async (req, res, next) => {
    const {id} = req.body
    const data = await testModel.findOneAndRemove({_id:id}).exec()
    res.json(data)
})

//修改
router.put('/test', async (req, res, next) => {
    const {id} = req.body
    const data = await testModel.findOneAndUpdate({_id: id}, {...req.body},{new:true}).exec()
    res.json(data)
})

module.exports = router;