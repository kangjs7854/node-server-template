const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性
const axios = require('axios')
const authSchema = mongoose.Schema({
    id:Number,
    url:String,
    name: String,
    avatar_url: String
})

const  authModel = mongoose.model('auth',  authSchema)


//查找
router.get('/auth', async (req, res, next) => {
    const {id} = req.query
    let query = {}
    id && (query = {_id:id})
    const data = await authModel.find(query)
    res.json(data)
})

//增加 || 更新
router.post('/auth', async (req, res, next) => {
    const { code } = req.body

    if (!code) return
    const clientID = '50ab343567bd310005df'
    const clientSecret = 'deea41faa0a55396c16f7679e16e61c2229f2f6a'
    let accessToken
    //根据临时code换取令牌
    try{
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://github.com/login/oauth/access_token?' +
                `client_id=${clientID}&` +
                `client_secret=${clientSecret}&` +
                `code=${code}`,
            headers: {
                accept: 'application/json'
            }
        });
        accessToken = tokenResponse.data.access_token;
        if(!accessToken){
            return res.json(tokenResponse.data)
        }
        //使用令牌请求gitHub的接口
        const result = await axios({
            method: 'get',
            url: `https://api.github.com/user`,
            headers: {
                accept: 'application/json',
                Authorization: `token ${accessToken}`
            }
        });
        res.json(result.data)

        //存储用户数据到数据库
        const query = { id:result.data.id }
        const payload = { ...result.data }
        await authModel.findOneAndUpdate(query, payload,{upsert:true,new:true}).exec()
    }catch (err){
        console.log(err)
        // //使用令牌请求gitHub的接口
        const result = await axios({
            method: 'get',
            url: `https://api.github.com/user`,
            headers: {
                accept: 'application/json',
                Authorization: `token ${accessToken}`
            }
        });
        res.json(result.data)
    }
})

//删除
router.delete('/auth', async (req, res, next) => {
    const {id} = req.body
    const data = await authModel.findOneAndRemove({_id:id}).exec()
    res.json(data)
})

//修改
router.put('/auth', async (req, res, next) => {
    const {id} = req.body
    const data = await authModel.findOneAndUpdate({_id: id}, {...req.body},{new:true}).exec()
    res.json(data)
})

module.exports = router;