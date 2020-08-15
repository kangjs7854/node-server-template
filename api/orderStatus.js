/*
 * @Date: 2020-08-12 11:41:10
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-15 15:01:32
 * @FilePath: \server\api\orderStatus.js
 */
const express = require('express');
const router = express.Router();

const { orderStatusModel, orderListModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来
const { find, insert, remove, update } = require('../controllers/index');
const { log } = require('debug');

//查找
router.get('/orderStatus', async (req, res, next) => {
    const { id } = req.query
    const orderStatus = await find(orderStatusModel, { _id: id })
    res.json(orderStatus)
})

//增加 || 更新
router.post('/orderStatus', async (req, res, next) => {
    const { id, memberId, orderId } = req.body
    if (!memberId && !orderId) return

    const query = { orderNo:orderId } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
    const payload = { ...req.body } //内容
    
    Object.assign(payload, { orderId})
    await insert(orderStatusModel, query, payload)
    const data = await find(orderStatusModel,query )
    res.json({data})
})

//删除
router.delete('/orderStatus', async (req, res, next) => {
    const { id } = req.body
    const data = await remove(orderStatusModel, id)
    res.json(data)
})

//修改
router.put('/orderStatus', async (req, res, next) => {
    const { id } = req.body
    const data = await update(orderStatusModel, { _id: id }, { ...req.body })
    res.json(data)
})

module.exports = router;