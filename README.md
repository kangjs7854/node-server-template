<!--
 * @Date: 2020-07-29 15:50:45
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-11 15:44:15
 * @FilePath: \server\README.md
--> 

# node-server-template

> node开发接口的项目模板，主要是用来开发一些api,在前端开发时方便mock数据，接口联调时更有效率地交付产品

```
|-- server
    |-- .gitignore 			git的忽略文件
    |-- app.js 				入口文件
    |-- package.json 			依赖
    |-- README.md 			项目说明文件
    |-- bin				配置
    |   |-- www
    |-- client
    |   |-- index.html 
    |-- controllers 			行为层
    |   |-- index.js 
    |-- model 				模型层
    |   |-- index.js
    |-- public 				公共资源文件
    |   |-- images
    |   |   |-- a1_bg_wu@2x.png
    |   |-- javascripts
    |   |   |-- WXBizDataCrypt.js 
    |   |-- stylesheets
    |       |-- style.css
    |-- routes 				api路由分发
    |   |-- appointmentOrder.js
    |   |-- card.js
    |   |-- clinicGuide.js
    |   |-- hos.js
    |   |-- index.js
    |   |-- memberInfo.js
    |   |-- order.js
    |   |-- orderList.js
    |   |-- patient.js
    |   |-- test.js
    |   |-- userInfo.js
    |   |-- userPhone.js
    |-- views 				视图层（这里未使用模板引擎，所以未使用）
        |-- error.jade
        |-- index.jade
        |-- layout.jade



```


## 1. 安装依赖

``` 

npm i 

```

## 2. 启动服务

> 通过nodemon实现了热更新，方便开发

``` 
npm run start

```

## 3. 数据库的操作

> nodejs没有内置的数据库，使用的mongodb属于非关系型数据库，对数据格式的处理很灵活，使用的键值对的方式存储对与前端开发者来说特别熟悉，除此以外，mongodb在大规模是io读写性能上特别的优异

#### * mongodb的安装完成后，可能会遇到启动闪退的问题，需要配置mongod.conf文件

1.  主要是要在目录多配置一个mongo.conf文件。如果mongodb的目录没有data文件夹，记得新建一个，为下方dbpath的路径

``` conf
#mongo.conf文件

# 新增的数据库的文件夹路径，根据自己的安装路径填写
dbpath=D:\Program Files\MongoDB\Server\4.2\data
# 新增的日志记录文件
logpath=D:\Program Files\MongoDB\Server\4.2\log\mongo.log
#错误日志采用追加模式
logappend=true
#启用日志文件，默认启用
journal=true
#这个选项可以过滤掉一些无用的日志信息，若需要调试使用请设置为false
quiet=true
#端口号 默认为27017
port=27017

```

2.  在bin目录打开cmd，安装mongodb服务

``` 
mongod.exe --config "//此处为第一步配置的mongo.conf文件的路径" --install 

```

3. 测试，启动服务

``` 
net start mongodb
//显示启动成功即可通过 http://localhost:27017/ 访问
```

4. 服务名无效的解决方法
- 将data目录删除
- 管理员模式打开cmd，进入mongodb的bin目录
- 再次安装服务
```
mongod --config "//此处为第一步配置的mongo.conf文件的路径 + mongo.conf"  --install --serviceName "mongodb"
```
- 再次启动服务 
```
net start mongodb 
```
#### * 启动服务之后需要安装mongoose模块来方便操作数据库

1. 安装依赖

``` 
npm i mongoose -S

```

2. 在入口文件引入并发起连接（app.js）

``` js
const mongoose = require("mongoose")
//连接mongodb服务
mongoose.set('useFindAndModify', false)
mongoose.connect('mongodb://localhost/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once("open", () => {
  console.log('mongodb connect success~');
})

```

3. mongoose的使用

> 这里用router文件夹中的index.js作为例子，通过如何创建一只小猫作为操作演示，简单理解mongoose的概念和使用

```js
const mongoose = require("mongoose")

//定义猫的模式，声明猫的属性和行为，也就是设置其对应的数据结构，
const catSchema = mongoose.Schema({
  name: String,
})

//声明猫的行为(注意不要使用箭头函数，导致this指向错误)
catSchema.methods.speak = function () {
  console.log( `my name is ${this.name}` );
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

```

## 4. api的生成

> express的路由可以将前端发送的响应网络请求，映射到对应的中间件去处理，当前端访问了index.js这个文件的路由localhost:3000/api/cat时就会触发该文件中的路由监听，即可处理对应的逻辑，进行数据库的操作等等，这里以index.js为例子

1. 定义index.js路由，处理逻辑

``` js
 */
var express = require('express');
var router = express.Router();
const mongoose = require("mongoose")

/**
**数据库的操作balabala...
**/

/**
 * @description: 监听路由，处理对应的逻辑
 * @param req {Object} 接收到的请求  可以获取请求的参数，req.query获取get请求的参数，req.body获取post请求的参数
 * @param res {Object} 对该请求的响应 res.json() 返回json格式的数据，res.send()渲染对应的文本等等
 * @param next {function} 负责将控制权交给下一个中间件，如果当前中间件的请求没有结束，且next函数没有调用，那么该请求会被挂起，后边定义的中间件都不会触发
 */

router.get('/cat', function (req, res, next) {
    //生成json格式的数据返回给前端
    res.json({
        code:0,
        msg:"success",
        cat_info:[
            {
                _id:'45647156456'
                name:'kitty',
                color:'pink'
            },
            {
                _id:'46546589784'
                name:'xiaobai',
                color:'white'
            },
        ]
    })
});

module.exports = router;

```

2. 在入口文件注册路由（app.js）

``` js
//引入路由
const indexRouter = require('./routes/index');

//api 路由的调用，定义其api路径名称
app.use('/api', indexRouter);

```
## 5. 跨域
> 到这儿前端就可以访问api来获取服务器的数据了，由于协议域名端口的不同，服务器的响应会被浏览器拦截，导致跨域的错误，需要做一些处理,列举一个最简单的，本质上还是通过设置响应头告诉浏览器允许跨域请求
1. 安装cors模块
```
npm i cors -S

```

2. 在入口文件引入并调用（app.js）
>注意要在定义api路由之前引入
```js
app.use(cors())

```

## 6. 快速生成代码片段
> 每次写一个curd的api需要敲很多重复代码，所以利用vscode自动生成代码段

- 1. 键盘F1打开顶部搜索栏，输入以下命令行
```
configure user snippets

```
- 2. 点击选择后，输入并点击
```
javascript.json

```
- 3. 配置基础的curd所需要的配置，根据文件名动态生成基础格式

通过输入node，即可快捷生成node增删改查的代码段,${TM_FILENAME_BASE} 为获取当前文件名
```json
{
	// Example:
	"Print to console": {
		"prefix": "node",
		"body": [
			"const express = require('express');",
			"const axios = require('axios')",
			"const mongoose = require('mongoose')",
			"const router = express.Router();",
			"",
			"const { ${TM_FILENAME_BASE}Model } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来",
			"const { insertOrUpDate } = require('../controllers/index')",
			"",
			"//查找",
			"router.get('/${TM_FILENAME_BASE}',((req,res,next) => {",
			"   const { id } = req.query",
			"   id ? ${TM_FILENAME_BASE}Model.findById(id).exec((err,${TM_FILENAME_BASE})=>res.json(${TM_FILENAME_BASE}))",
			"   :${TM_FILENAME_BASE}Model.find().exec((err,${TM_FILENAME_BASE}s)=>res.json(${TM_FILENAME_BASE}s))",
			"}))",
			"",
			"//增加",
			"router.post('/${TM_FILENAME_BASE}',((req,res,next) => {",
			"   const { id } = req.body",
			"   insertOrUpDate(${TM_FILENAME_BASE}Model, {_id: id}, req.body,[],'list')",
			"   .then(data=>{",
			"       res.json(data)",
			"   })",
			"   .catch(err=>{",
			"       res.send(err)",
			"   })",
			"}))",
			"",
			"//删除",
			"router.delete('/${TM_FILENAME_BASE}',((req,res,next) => {",
			"   const {id} = req.body",
			"   ${TM_FILENAME_BASE}Model.findByIdAndRemove(id,(err,removed)=>res.json(removed))",
			"}))",
			"",
			"//修改",
			"router.put('/${TM_FILENAME_BASE}',((req,res,next) => {",
			"   const {id} = req.body",
			"   ${TM_FILENAME_BASE}Model.findByIdAndUpdate(id,{...req.body},{new:true},(err,updated)=>res.json(updated))",
			"}))",
			"",
			"module.exports = router;"
		],
		"description": "Log output to console"
	}
}
```
- 4. 快速尝试
>在router文件夹下新建一个test.js，输入node,回车应该就会出现这一大段代码
```js
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();

const { testModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来
const { insertOrUpDate } = require('../controllers/index')

//查找
router.get('/test', ((req, res, next) => {
    const { id } = req.query
    id ? testModel.findById(id).exec((err, test) => res.json(test))
        : testModel.find().exec((err, tests) => res.json(tests))
}))

//增加
router.post('/test', ((req, res, next) => {
    const { id } = req.body
    insertOrUpDate(testModel, { _id: id }, req.body, [], 'list')
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            res.send(err)
        })
}))

//删除
router.delete('/test', ((req, res, next) => {
    const { id } = req.body
    testModel.findByIdAndRemove(id, (err, removed) => res.json(removed))
}))

//修改
router.put('/test', ((req, res, next) => {
    const { id } = req.body
    testModel.findByIdAndUpdate(id, { ...req.body }, { new: true }, (err, updated) => res.json(updated))
}))

module.exports = router;

```
- 5. 批量引入路由到入口文件（app.js）
> 当api文件越来越多，每次都要繁琐的引入到app.js并且调用app.use()，非常的不方便,一开始想使用webpack中用的比较多的  require.context（）在批量引入，但是在nodej懒得安装webpack及配置，于是利用了var声明变量的老旧特性（变废为宝？）
```js
//记得引入fs模块
const fs = require('fs')

//批量动态引入路由
const allRoutes = fs.readdirSync("./routes");//读取routes文件夹下的所有文件名
allRoutes.forEach(el => {
  var el = require("./routes/" + el)
  app.use('/api', el)
})


```

- 6. 定义数据结构的模式和模型
> 以第4步的test.js为例子 
```js
const mongoose = require("mongoose")

//定义模式的属性和行为
const testSchema = mongoose.Schema({
    name: String
})

//通过模式生成模型
const testModel = mongoose.model("testModel", testSchema)

module.exports = {
    testModel //此处导出的testModel名称应与第四步导入的名称一致
}

```
- 7. 编写controllers
 通过代码片段已经快速生成了增删改查的代码模板，也定义了数据结构，实际上在传统的mvc模型中，
 还需要controllers来更好的处理业务逻辑，这里我封装了一个插入或更新的函数

 新建controllers文件夹,以及index.js

 ````js
module.exports = {
    /**
     * @description
     * 1.没传id，返回全部内容
     * 2.传id，无文档，创建一个
     * 2.传id，有文档，更新
     * @param {Object} Model 需要进行数据操作的模型
     * @param {Object} query 匹配条件，有就更新，无就新增
     * @param {Object} payload 需要插入或者更新的内容
     * @param {Array} populate 一个参数的时候表示返回全部，两个参数的时候返回对应的联表的属性
     * @param {String} dataName 需要返回的主要的data的数据名称
     * @return {Object} 返回处理完的数据
     */
    insertOrUpDate(Model, query = {}, payload = {}, populate = [], dataName = "list") {
        return new Promise((resolve, reject) => {
            const temp = JSON.stringify(query) != "{}"
                ? Model.findOneAndUpdate(
                    query,
                    payload,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                )
                : Model.find().populate(populate[0], populate[1])
            temp.populate(populate[0], populate[1]).exec((err, data) => {
                if (err) return reject(err)
                const result = {
                    returnCode: 200,
                    returnMsg: "成功",
                    data: {
                        [dataName]: data,
                        timestamp: new Date().getTime(),
                        extendData: {
                            data: '扩展字段'
                        },
                    },
                }
                resolve(result)
            })
        })
    }
}


 ````


7. postman测试api
 下载postman，完成api增删改查的测试~


## 7. 数据库进阶
>对同一个数据表或者文档进行操作是很容易上手的，但是实际业务中有着很多复杂的场景，数据结构较为复杂，就需要使用到联表的操作

假设有这么两个模型

````js
const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
	orderType:String
    price: Number,
    buyer: {
        type: mongoose.Schema.Types.ObjectId,//联表查询必须这样的格式来存储对应表的._id
        ref: 'User'//联表关系的表名，注意是生成模型的类，与模型区分开
    }
})

const userSchema = mongoose.Schema({
    username: String,
})

const orderModel = mongoose.model("Order",orderSchema)
const userModel = mongoose.model("User",userSchema)

const newUser = new userModel({
	username: 'kjs',
})

/**
 * 
 * @description:存储。将用户的id，关联到订单模型的buyer字段 
 * @param {type} 
 * @return {type} 
 */
newUser.save((err,saved)=>{
	const newOrder = new OrderModel({
		orderType:"奶茶"
		price:10,
		buyer:res._id
	})
	newOrder.save()
})

/**
 * @description: 查询
 * @param {type} populate()第一个参数表示通过什么字段去联表并用来放入查到的联表数据,
 *  第二个参数表示只返回某个字段默认全部返回
 * @return {type} 
 */
orderModel.find({orderType:"奶茶"}).populate(('buyer'))

````

