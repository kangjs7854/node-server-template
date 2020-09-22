


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性

const jwtToken = require('jsonwebtoken')//生成用户签名和验证
const secretKey = 'mock_platform_666'

function createToken(target) {
    return jwtToken.sign(target, secretKey, {expiresIn: 60 * 60 * 24}) // 授权时效24小时
}


const jwtSchema = mongoose.Schema({
    userName: String,
    passWord: Number,
    isAdmin: Boolean
})

const jwtModel = mongoose.model('jwt',  jwtSchema)


//查找
router.get('/jwt', async (req, res, next) => {
    const {id} = req.query
    let query = {}
    id && (query = {_id:id})
    const data = await jwtModel.find(query)
    res.json(data)
})

//增加 || 更新
router.post('/jwt', async (req, res, next) => {
    const {userName, passWord} = req.body
    const query = {userName}
    const payload = {...req.body}

    const user = await jwtModel.find(query).exec()
    if (!user) {//新用户
        const {userName} = await jwtModel.findOneAndUpdate(query, payload, {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
        }).exec()
        return res.json({
            data: {
                userName,
                token: createToken({userName})
            },
            code: 0,
            msg: "创建成功"
        })
    }
    const data = await jwtModel.findOne(query).exec()
    if (data.passWord != passWord) {
        return res.json({
            data: {
                userName: data.userName
            },
            code: 1,
            msg: '账号密码错误'
        })
    }
    res.json({
        data: {
            userName: data.userName,
            token: createToken({userName: data.userName})
        },
        code:  0,
        msg: '登录成功'
    })

})

//删除
router.delete('/jwt', async (req, res, next) => {
    const {id} = req.body
    const data = await jwtModel.findOneAndRemove({_id:id}).exec()
    res.json(data)
})

//修改
router.put('/jwt', async (req, res, next) => {
    const {id} = req.body
    const data = await jwtModel.findOneAndUpdate({_id: id}, {...req.body},{new:true}).exec()
    res.json(data)
})

module.exports = router;