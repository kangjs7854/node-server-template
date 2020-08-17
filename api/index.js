/*
 * @Date: 2020-07-23 10:16:24
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-31 15:20:55
 * @FilePath: \server\routes\index.js
 */
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")

//定义猫的模式，声明猫的属性和行为，也就是设置其对应的数据结构，
const catSchema = mongoose.Schema({
  name: String,
})

//声明猫的行为(注意不要使用箭头函数，导致this指向错误)
catSchema.methods.speak = function () {
  console.log(`my name is ${this.name}`);
}

//通过猫的模式定义模型，这个模型就是构造文档(document)的类
const Cat = mongoose.model('Cat', catSchema)



/**
 * @description: 监听路由，处理对应的逻辑
 * @param req  接收到的请求  可以获取请求的参数，req.query获取get请求的参数，req.body获取post请求的参数
 * @param res  对该请求的响应 res.json() 返回json格式的数据，res.sen()渲染对应的文本等等
 * @param next 负责将控制权交给下一个中间件，如果当前中间件的请求没有结束，且next函数没有调用，那么该请求会被挂起，后边定义的中间件都不会触发
 */
router.get('/cat', function (req, res, next) {
  //后来小猫越来越多，就可以通过模型来查找小猫
  Cat.find((err, allCats) => {
    if (err) return console.error(err)
    res.json(allCats)
  })
});

router.post('/cat', ((req, res, next) => {
  //通过调用该构造函数生成小猫,生成对应的文档(document)
  const lititleCat = new Cat(Object.assign({ name: 'kitty' },req.body))
  //小猫在调用save方法后保存到数据库
  lititleCat.save((err, saved) => res.json(saved))
}))

router.delete('/cat', ((req, res, next) => {
  const { id } = req.body
  Cat.findByIdAndRemove(id, (err, removed) => res.json(removed))
}))

router.put('/cat', ((req, res, next) => {
  const { id } = req.body
  Cat.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;