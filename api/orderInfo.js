/*
 * @Date: 2020-08-12 11:41:10
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-12 18:31:38
 * @FilePath: \server\routes\orderInfo.js
 */
const express = require('express');
const router = express.Router();

const { orderInfoModel, orderListModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

const templateResult = {
    returnCode: 200,
    returnMsg: "成功",
    data: {
        orderInfo: {},
        timestamp: new Date().getTime(),
        extendData: {
            data: '扩展字段'
        },
    },
}
//查找
router.get('/orderInfo', ((req, res, next) => {
    const { id } = req.query
    id ? orderInfoModel.findById(id).exec((err, orderInfo) => res.json(orderInfo))
        : orderInfoModel.find().exec((err, orderInfos) => res.json(orderInfos))
}))

//增加
router.post('/orderInfo', async (req, res, next) => {
    const { memberId, orderId, isEdit } = req.body
    if (!memberId && !orderId) return res.json([])

    try {
        if (!isEdit) {
            const oderInfos = await orderInfoModel.find().populate("orderId").exec()
            Object.assign(templateResult.data, {
                orderInfo: oderInfos[0]
            })
            return res.json(templateResult)
        }
        const orderInfo = await orderListModel.findById(orderId).exec()
        const data = await orderInfoModel.findOneAndUpdate(
            { orderId: orderInfo._id },
            { ...req.body, orderId: orderInfo._id },
            { upsert: true, new: true, setDefaultsOnInsert: true }).exec()
        res.json(data)
    } catch (error) {
        console.log(error);
    }
})

//删除
router.delete('/orderInfo', async (req, res, next) => {
    const { id } = req.body
    const orderInfos = await orderInfoModel.find().exec()
    const result = []
    for (let i = 0; i < orderInfos.length; i++) {
        if (el._id != id) {
            const deleted = await orderInfoModel.deleteOne({ _id: el._id })
            result.push(deleted._id)

        }
    }
    res.json(result)
})

//修改
router.put('/orderInfo', ((req, res, next) => {
    const { id } = req.body
    orderInfoModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;