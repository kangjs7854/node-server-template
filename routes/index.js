/*
 * @Date: 2020-07-23 10:16:24
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-30 10:13:30
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

//通过调用该构造函数生成小猫,生成对应的文档(document)
const lititleCat = new Cat({ name: 'kitty' })

//小猫在调用save方法后保存到数据库
lititleCat.save((err, lititleCat) => {
  if (err) return console.error(err);
  lititleCat.speak()//log ==> my name is kitty
})

//后来小猫越来越多，就可以通过模型来查找小猫
Cat.find((err,allCats)=>{
  if(err) return console.error(err)
  console.log(allCats);
})


/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.send(lititleCat.name)
});

module.exports = router;
