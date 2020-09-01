<!--
 * @Date: 2020-07-29 15:50:45
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-25 10:21:57
 * @FilePath: \server\README.md
--> 

# node-server-template

> node开发接口的项目模板，主要是用来开发一些api,在前端开发时方便mock数据，接口联调时更有效率地交付产品。另一方面，学习使用node可以扩展自己的知识面，接触到网络数据库相关的知识

服务端的架构是经典的MVC模式
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
    |-- controllers 			行为层,封装了增删改查的控制器的类
    |   |-- index.js 
    |-- model 				模型层，定义所需数据的结构和行为
    |   |-- index.js
    |-- public 				公共资源文件
    |   |-- images
    |   |   |-- a1_bg_wu@2x.png
    |   |-- javascripts
    |   |   |-- WXBizDataCrypt.js 
    |   |-- stylesheets
    |       |-- style.css
    |-- routes 				定义api接口
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
    |-- views 				视图层
        |-- error.jade
        |-- index.jade
        |-- layout.jade



```


# 准备阶段


- ### 拉取代码
```
git clone https://github.com/kangjs7854/node-server-template.git
```
- ### 安装依赖
```
npm i 

```
- ### 安装mongodb  
官网自行下载，安装完启动时可能会遇到启动闪退的问题，需要配置mongod.conf文件。解决方法：
 1. 主要是要在目录多配置一个mongo.conf文件。如果mongodb的目录没有data文件夹，记得新建一个，为下方dbpath的路径

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
mongod.exe --config "//此处为第一步配置的mongo.conf文件的路径 + mongo.conf" --install 

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

- ### 运行node服务
```
npm run start
```


- ### 学习mongoose的使用

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

- ### 学习api的生成

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
        catInfo:[
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

3. 访问localhoset:3000/api/cat获取数据



- ### 学习数据库的进阶操作，联表
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


- ### 学习更优雅的处理异步
> mongoose操作数据库以及express的api有着大量的异步操作，这本身就是node的一个特色，使用事件驱动的方式异步的去进行io操作，极大提高了性能，但是大量的回调函数确实给开发者带来了不少的烦恼，一方面是函数嵌套过深，不好维护；在我看来更大的困难是哪怕是使用promise来解决回调的问题，调式时也非常的不方便，没法通过打断点直观的查看，这里就要使用到es7的async await来解决问题

- mongoose内置的save方法会返回一个thenable,这意味着我们可以通过使用promise的then来处理保存后的逻辑

```
const promise = testModel.save()
promise.then(res=>{

})


```

- mongoose的查询的方法返回的不是一个完整的promise，可以加上exec()函数更好的追踪堆栈
```
await testModel.findOne()
await testModel.findOne().exec()

```

虽然就功能而已，上面两个是等效的，但是推荐使用加上exec()函数



# 正式开始
> 有了前面的介绍，应该对node开发restful服务有了一定的认识，接下来就一起来创建一个test的api，愉快的mock数据吧！

在开发一个api时我们应该思考需要它实现什么样的功能，需要我们定义什么格式的数据结构来满足需求，在访问该api时如何处理业务逻辑

所以首当其冲,我们先

- ### 定义数据结构的模式和模型
>Model/index.js
```js
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Model = mongoose.model

//联表时用于标志存储数据的唯一性
const ObjectId = Schema.Types.ObjectId;

//定义模式的属性和行为
const testSchema = Schema({
    name: String
})

//通过模式生成模型
const testModel = model("testModel", testSchema)

//导出模型，以便api通过它进行数据的操作
module.exports = {
    testModel 
}
```

在传统的mvc模型中，M代表模型，V代表视图，即最后的展示的json数据；C就是controller，代表了行为的操作

我们定义了数据的模型，接下来就做的就是数据行为的操作

- ### 定义行为
>controller/index.js,定义了通过mongoose进行增删改查的数据操作，其中使用async和await优化了异步处理

 ````js
module.exports = {
    find,
    insert,
    remove,
    update
}
async function find(Model, query = {}, populate = []) {
    //匹配条件为空，返回全部,否则返回匹配到的数据
    return isNull(query)
        ? await Model.find().populate(populate[0], populate[1]).exec()
        : await Model.findOne(query).populate(populate[0], populate[1]).exec()
}

async function insert(Model, query = {}, payload = {}, populate = []) {
    !isNull(query) && await Model.findOneAndUpdate(query, payload, { upsert: true, new: true, setDefaultsOnInsert: true }).exec()
    return await Model.find().populate(populate[0], populate[1]).exec()
}

async function remove(Model, id, isRemoveAll = false, populate = []) {
    if (isRemoveAll) {
        const data = await Model.find().exec()
        for (let i = 0; i < data.length; i++) {
            if (data[i]._id != id) {
                await Model.findByIdAndRemove(data[i]._id)
            }
        }
    } else {
        await Model.findByIdAndRemove(id).exec()
    }
    return await Model.find().populate(populate[0], populate[1]).exec()
}

async function update(Model,query,payload){
    await Model.findOneAndUpdate(query,payload).exec()
    return await Model.find().exec()
}

function isNull(obj) {
    for (let i in obj) {
        return obj[i] == 'undefined' || obj[i] == 'null' || !obj[i]
    }
}


 ````

 - ### api路由分发
> 使用express的路由机制，在访问路由时触发对应的中间件及对应的controller函数，完成对数据的操作，把我们想要的数据返回给客户端

 ```js
const express = require('express');
const router = express.Router();

const { testModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来
const { find, insert, remove,update } = require('../controllers/index');

//查找
router.get('/test', async(req, res, next) => {
   const { id } = req.query
   const test = await find(testModel, { _id: id })
   res.json(test)
})

//增加 || 更新
router.post('/test', async(req,res,next) => {
   const { id, name } = req.body
   const query = { name } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
   const payload = { ...req.body } //内容

   const data = await insert(testModel, query, payload)
   res.json(data)
})

//删除
router.delete('/test', async(req,res,next) => {
   const { id } = req.body
   const data = await remove(testModel,id)
   res.json(data)
})

//修改
router.put('/test', async(req,res,next) => {
   const { id } = req.body
  const data = await update(testModel, { _id: id }, { ...req.body })
   res.json(data)
})

module.exports = router;
```

- ### 引入路由及注册
> 原本需要在app.js入口文件引入编写的router文件，然后对齐进行注册使用，考虑到api文件越来越多导致的繁琐操作，使用了批量引入的方法

 当api文件越来越多，每次都要繁琐的引入到app.js并且调用app.use()，非常的不方便,一开始想使用webpack中用的比较多的  require.context（）在批量引入，但是在nodej懒得安装webpack及配置，于是利用了var声明变量的老旧特性（变废为宝？）
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

到这我们就完成了一个api的开发

打开浏览器输入 localhost:3000/api/test,应该可以看到一个空数组的标识，这是因为此时还没有数据

赶紧下载postman进行增删改查的操作把！


- ### 快速生成代码片段
> 每次写一个curd的api需要敲很多重复代码，所以利用vscode自动生成代码段(其实是因为懒)

1. 键盘F1打开顶部搜索栏，输入以下命令行
```
configure user snippets

```
2. 点击选择后，输入并点击
```
javascript.json

```
3. 配置基础的curd所需要的配置，根据文件名动态生成基础格式

通过输入node，即可快捷生成node增删改查的代码段,${TM_FILENAME_BASE} 为获取当前文件名
```json
{
	// Place your snippets for javascript here. Each snippet is defined under a snippet name and has a prefix, body and 
	// description. The prefix is what is used to trigger the snippet and the body will be expanded and inserted. Possible variables are:
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. Placeholders with the 
	// same ids are connected.
	// Example:
	"Print to console": {
		"prefix": "node",
		"body": [
			"const express = require('express');",
			"const router = express.Router();",
			"",
			"const { ${TM_FILENAME_BASE}Model } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来",
			"const { find, insert, remove,update } = require('../controllers/index');",
			"",
			"//查找",
			"router.get('/${TM_FILENAME_BASE}', async(req, res, next) => {",
			"   const { id } = req.query",
			"   const ${TM_FILENAME_BASE} = await find(${TM_FILENAME_BASE}Model, { _id: id })",
			"   res.json(${TM_FILENAME_BASE})",
			"})",
			"",
			"//增加 || 更新",
			"router.post('/${TM_FILENAME_BASE}', async(req,res,next) => {",
			"   const { id, name } = req.body",
			"   const query = { name } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件",
			"   const payload = { ...req.body } //内容",
			"",
			"   const data = await insert(${TM_FILENAME_BASE}Model, query, payload)",
			"   res.json(data)",
			"})",
			"",
			"//删除",
			"router.delete('/${TM_FILENAME_BASE}', async(req,res,next) => {",
			"   const { id } = req.body",
			"   const data = await remove(${TM_FILENAME_BASE}Model,id)",
			"   res.json(data)",
			"})",
			"",
			"//修改",
			"router.put('/${TM_FILENAME_BASE}', async(req,res,next) => {",
			"   const { id } = req.body",
			"  const data = await update(${TM_FILENAME_BASE}Model, { _id: id }, { ...req.body })",
			"   res.json(data)",
			"})",
			"",
			"module.exports = router;"
		],
		"description": "Log output to console"
	}
}
```
4. 快速尝试

假如你接下来还要想创建一个用户的api，只需要定义用户的数据结构，将其模型暴露出去

```js
//model/index.js
const userSchema = Shcema({
    name:String,
    age:Number,
    sex:String
})

const userModel = Model('User',userSchema)

module.exports = {
    userModel
}

```


在routes文件夹创建一个新的api文件user.js

在编辑器敲击 ```node ``` 出现提示回车，是不是出现了这么一大片的代码


```js
const express = require('express');
const router = express.Router();

const { userModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来
const { find, insert, remove,update } = require('../controllers/index');

//查找
router.get('/user', async(req, res, next) => {
   const { id } = req.query
   const user = await find(userModel, { _id: id })
   res.json(user)
})

//增加 || 更新
router.post('/user', async(req,res,next) => {
   const { id, name } = req.body
   const query = { name } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
   const payload = { ...req.body } //内容

   const data = await insert(userModel, query, payload)
   res.json(data)
})

//删除
router.delete('/user', async(req,res,next) => {
   const { id } = req.body
   const data = await remove(userModel,id)
   res.json(data)
})

//修改
router.put('/user', async(req,res,next) => {
   const { id } = req.body
  const data = await update(userModel, { _id: id }, { ...req.body })
   res.json(data)
})

module.exports = router;


```

然后你打开postman输入localhost:3000/api/user 是不是就可以愉快的进行增删改查了，愉快的进行数据mock了

作为一个没有感情的切图仔，自从有了这个模板，人已经在postman mock到失联，成为了一个没有感情的curd仔


# 优化
> 虽然定义了增删改查的函数，但是每次都要把数据模型作为参数引入，十分的麻烦

这里可以使用es6的class，通过传入模型生成控制器的实例,把增删改查作为实例的方法。
```js
//controller/index.js
module.exports = class Controller {
    constructor(Model) {
        this.Model = Model
    }

    static isNull(obj) {
        for (let i in obj) {
            return obj[i] == 'undefined' || obj[i] == 'null' || !obj[i]
        }
    }

    async find(query = {}, populate = []) {
        //匹配条件为空，返回全部,否则返回匹配到的数据
        return Controller.isNull(query)
            ? await this.Model.find().populate(populate[0], populate[1]).exec()
            : await this.Model.findOne(query).populate(populate[0], populate[1]).exec()
    }

    async insert(query = {}, payload = {}, populate = []) {
       //省略
    }

    async remove(id, isRemoveAll = false, populate = []) {
       //省略
    }

    async update(query, payload) {
       //省略
    }
}
```

这样在新建一个api时，就可以把该控制器的类引入，然后通过传入数据模型，生成该实例的控制器，更好的实现增删改查。

其实可以把生成模型的过程也做类似的处理，我们在mock接口的时候，只需要传入需要的数据字段及类型，就可以快速实现api接口的增删改查。
把Model抽离成出去一个单独的模块其实在这里有点矫正过忹的意思，很多时候为了查看我写的这个api，有什么样的数据格式我得在一堆schema中反复滚动
所以我在model层新建了一个快速生成数据模型的类，在需要快速mock接口时可以使用到这个。

```js
//model/index.js
class quicklyMockModel{
    constructor(ModelName,schema){
        this.Schema = mongoose.Schema(schema)
        this.Model = mongoose.model(ModelName,this.Schema)
    }
}
```

接下来就还是使用test.js这个api路由作为例子

```js
const { quicklyMockModel } = require('../model/index') 
const Controller = require('../controllers/index');
//快速mock数据，生成数据模型
const test = new quicklyMockModel('test',{
    name:String,
    age:Number
})
//传入该模型生成控制器
const testController = new Controller(test.Model)

//查找
router.get('/test', async(req, res, next) => {
   const { id } = req.query
   const test = await testController.find({ _id: id })
   res.json(test)
})

//增加 || 更新
router.post('/test', async(req,res,next) => {
   const { id, name } = req.body
   const query = { name } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件
   const payload = { ...req.body } //内容

   const data = await testController.insert(query, payload)
   res.json(data)
})
```
这样处理之后，我们只需要改变所需要的字段和数据类型，就可以快速生成增删改查的符合restful风格的api；
控制器的行为也更加优雅，只需要关注检索的参数。


# 部署

1. vscode扩展程序搜索```docker```安装后点击```F1```输入```Add Docker file to workspace```快速生成docker相关的文件
   
- ```Dockerfile```
- ```docker-compose```
- ```.dockerignore```

2. 数据库配置

- ```docker-compose``` 新增拉去mongodb数据库的镜像
  ```
        services:
    +   db:
    +       image: mongo
    +       restart: always
        server:
            image: server
            build: .
            environment:
            NODE_ENV: production
            ports:
            - 5000
  ```

- ```Dockerfile```新增数据库环境变量
  ```
        # 设置环境变量
        ENV NODE_ENV=production
    +   ENV MONGO_URI=mongodb://db:27017/mock
        ENV HOST=0.0.0.0
        ENV PORT=5000
  ```

- 修改数据库连接路径
  ```
    +   const mongodbPath = process.env.MONGO_URI || 'mongodb://localhost/test'
        mongoose.connect( mongodbPath, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

  ```

3. 推送到服务器  
   这一步是要将项目拷贝到购买的云服务器上，可以使用xftp这样的便于传入资源到服务器上的软件，也可以在云服务器上使用git拉取项目

4. 生成镜像并运行容器  
   - 进入服务器存放改项目的路径，例如我的是```/home/mock```
   - 运行```docker-compose up --build```等待编译完成实现部署
   - 若无报错运行```docker ps```查看所有运行的容器
  

