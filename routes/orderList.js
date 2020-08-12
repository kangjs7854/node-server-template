/*
 * @Date: 2020-08-11 09:41:34
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-12 11:52:32
 * @FilePath: \server\routes\orderList.js
 */
const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();

const { orderListModel, memberInfoModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

const templateResult = {
    returnCode: 200,
    returnMsg: "成功",
    data: {
        timestamp: new Date().getTime(),
        extendData: {
            data: '扩展字段'
        },
    },
}

//查找
router.get('/orderList', ((req, res, next) => {
    const { id } = req.query
    id ? orderListModel.findById(id).exec((err, orderList) => res.json(orderList))
        : orderListModel.find().exec((err, orderLists) => res.json(orderLists))
}))

//增加
router.post('/orderList', async (req, res, next) => {
    const { memberId, doctorName } = req.body

    if (!memberId) return res.json(null)

    if (!doctorName) {
        const memberInfo = await memberInfoModel.findById(memberId).populate('orders').exec()
        Object.assign(templateResult.data, {
            orderList: memberInfo.orders
        })
        res.json(templateResult)
        return
    }


    try {
        const memberName = await getUserName()
        saveOrder(memberName)
    } catch (error) {
        console.log(error);
    }


    async function getUserName() {
        const memberInfo = await memberInfoModel.findById(memberId)
        return memberInfo.memberName
    }

    async function saveOrder(memberName) {
        const orderInfo = await orderListModel.findOneAndUpdate(//同个医生名就更新数据，否则创建新数据,为了方便mock增加数据和更新
            { doctorName },
            { ...req.body, userName: memberName },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }).exec()
            saveMember(orderInfo)
    }

    async function saveMember(orderInfo) {
        const data = await memberInfoModel.findOneAndUpdate(
            { _id: memberId },
            { $addToSet: { 'orders': orderInfo._id } },
            { new: true }).exec()
            res.json(data)
    }


})

//删除
router.delete('/orderList', ((req, res, next) => {
    const { id } = req.body
    orderListModel.findByIdAndRemove(id, (err, removed) => res.json(removed))
}))

//修改
router.put('/orderList', ((req, res, next) => {
    const { id } = req.body
    orderListModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;



