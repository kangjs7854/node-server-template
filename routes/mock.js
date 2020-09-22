/*
 * @Date: 2020-08-18 10:33:27
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-21 15:47:49
 * @FilePath: \server\routes\mock.js
 */
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const expressJwt = require("express-jwt")
const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性

const mockSchema = mongoose.Schema()

let mockModel, mockController
const secretKey = 'mock_platform_666'

const allMockSchema = mongoose.Schema({
    method: String,
    apiName: String,
    dataSource: [
        {
            id: String,
            key: String,
            value: String,
            unique: Boolean,
            type: {
                type: String
            },
            children: [{
                id: String,
                key: String,
                value: String,
                type: {
                    type: String
                },
                isInner: Boolean
            }],
            test: String
        }
    ],
})
const allMockModel = mongoose.model('AllMockApi', allMockSchema)

//查找
router.get('/mock', async (req, res, next) => {
    const mock = await allMockModel.find({}).exec()
    res.json(mock)
})


router.get("/mock/:id", async (req, res) => {
    const apiName = req.params.id
    const mockApiRecord = await allMockModel.find({apiName}).exec()
    if (!mockApiRecord) return
    const {mockController, query, payload} = handleDataSource(mockApiRecord.dataSource, apiName)
    const data = await mockController.find({})
    res.json({data})
})

//expressJwt 判断token是否过期，过期自动返回401
router.post('/mock/:id', expressJwt({secret: secretKey, algorithms: ['HS256']}), async (req, res, next) => {
    const {newData, deleteId, deleteKey, isInsert} = req.body
    const apiName = req.body.apiName || req.params.id
    let resData//响应结果
    if (!apiName) return
    //只记住第一次传入时的数据模型,查找mock过的api的记录
    const mockApiRecord = await allMockModel.find({apiName}).exec()
    //表格数据
    const dataSource = req.body.dataSource || mockApiRecord[0].dataSource || []

    let {mockModel, query, payload} = handleDataSource(dataSource, apiName)

    if (deleteId) {
        await mockModel.findOneAndRemove({_id: deleteId}).exec()
    } else if (isInsert) {
        await mockModel.findOneAndUpdate(query, payload, {upsert: true, new: true}).exec()
        //保存该mock的api到api列表
        await allMockModel.findOneAndUpdate({apiName}, {
            dataSource,
            method: 'POST',
            apiName
        }, {upsert: true, new: true}).exec()
    } else if (newData) {
        query = {_id: newData._id}
        payload = deleteKey ? {$unset: {[deleteKey]: ''}} : newData
        await mockModel.findOneAndUpdate(query, payload, {upsert: true, new: true}).exec()
    }

    resData = await mockModel.find({}).exec()
    res.json({data: resData, code: 0, msg: "请求成功"})
})


/**
 * @description 处理表格数据
 * @param dataSource 表格数据
 * @param apiName
 * @returns {{query: 查询条件, payload:填充内容 mockModel: 数据模型}}
 */
function handleDataSource(dataSource, apiName) {
    let uniqueObj = {}//含有唯一标识的key的对象
    let query = {} //匹配条件,根据什么字段进行插入或者更新
    const Schema = {}//数据模式
    const payload = {} //数据内容
    const innerSchema = {}//嵌套对象时，该对象的数据模式
    const innerPayload = {}//嵌套对象时，该对象的数据内容
    //处理前端传过来的表格数据，转化成Schema和需要插入或更新的数据内容payload
    dataSource.forEach(el => {
        if (el.unique) {
            uniqueObj = el
            query = {[uniqueObj.key]: uniqueObj.value}
        }
        //处理引用类型的数据结构
        if (el.children && el.children.length) {
            const innerDataSource = el.children
            innerDataSource.forEach(innerEl => {
                innerSchema[innerEl.key] = innerEl.type
                innerPayload[innerEl.key] = innerEl.value
            })
            Schema[el.key] = el.type == 'Array' ? [innerSchema] : innerSchema
            payload[el.key] = el.type == 'Array' ? [innerPayload] : innerPayload
            return
        }
        Schema[el.key] = el.type
        payload[el.key] = el.value
    })
    //动态添加schema的字段和数据类型
    mockSchema.add(Schema)
    //再生成模型
    mockModel = mongoose.model(apiName, mockSchema)
    return {
        mockModel,
        query,
        payload
    }
}

//删除
router.delete('/mock/:id', async (req, res, next) => {
    const {id} = req.body
    const apiName = req.params.id
    const mockApiRecord = await allMockModel.find({apiName}).exec()
    if (!mockApiRecord) return
    const {mockController} = handleDataSource(mockApiRecord.dataSource, apiName)
    const data = await mockController.remove({_id: id})
    res.json(data)
})

router.delete('/mock', async (req, res, next) => {
    const {apiName} = req.body
    await allMockModel.findOneAndRemove({apiName}).exec()
    const data = await allMockModel.find().exec()
    res.json(data)
})

//修改
router.put('/mock', async (req, res, next) => {
    const {id} = req.body
    const apiName = req.params.id
    const mockApiRecord = await allMockModel.find({apiName}).exec()
    if (!mockApiRecord) return
    const {mockController} = handleDataSource(mockApiRecord.dataSource, apiName)
    const data = await mockController.update({_id: id}, {...req.body})
    res.json(data)
})


module.exports = router;