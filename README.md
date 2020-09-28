
# node-server-template

node开发接口的项目模板，通过封装以及vscode自定义代码块的功能，只需传入所需的数据字段，快速生成restful风格的api

# 项目结构
```
|-- server
    |-- app.js 	入口文件
    |-- package.json  依赖
    |-- README.md 项目说明文件
    |-- bin	 配置
    |   |-- www
    |-- model 模型层，定义所需数据的结构和行为
    |   |-- index.js
    |-- public 	公共资源文件
    |-- routes 	 定义api接口
    |   |-- appointmentOrder.js
    |   |-- card.js
    |   |-- clinicGuide.js
    |   |-- hos.js
    |   |-- index.js
    |   |-- memberInfo.js
    |   |-- order.js
    |   |-- mock.js 可视化配置数据接口的逻辑
    |   |-- orderList.js
    |   |-- patient.js
    |   |-- test.js
    |   |-- userInfo.js
    |   |-- userPhone.js    
    |-- views 视图层
        |-- error.jade
        |-- index.jade
        |-- layout.jade



```


- ## 使用编译器生成代码模板

这里使用的是webstorm，设置里添加 live template;```$apiName$```表示变量名称，生成代码片段后光标会自动聚焦变量名上，即可输入所需要定义的api名称。当然，使用vscode也可以实现类似的效果

```
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性

const $apiName$Schema = mongoose.Schema({
    name: String,
    age: Number
})

const  $apiName$Model = mongoose.model('$apiName$',  $apiName$Schema)


//查找
router.get('/$apiName$', async (req, res, next) => {
    const {id} = req.query
    let query = {}
    id && (query = {_id:id})
    const data = await $apiName$Model.find(query)
    res.json(data)
})

//增加 || 更新
router.post('/$apiName$', async (req, res, next) => {
    const {name} = req.body
    const query = {name} //检索条件
    const payload = {...req.body} //填充内容
    //如果文档中不存在该数据，插入，否则更新
    await $apiName$Model.findOneAndUpdate(query, payload,  {upsert: true,new:true}).exec()
    //返回所有的数据
    const data  = await $apiName$Model.find().exec()
    res.json(data)
})

//删除
router.delete('/$apiName$', async (req, res, next) => {
    const {id} = req.body
    const data = await $apiName$Model.findOneAndRemove({_id:id}).exec()
    res.json(data)
})

//修改
router.put('/$apiName$', async (req, res, next) => {
    const {id} = req.body
    const data = await $apiName$Model.findOneAndUpdate({_id: id}, {...req.body},{new:true}).exec()
    res.json(data)
})

module.exports = router;
```
## 启动服务 

在routes文件夹创建一个新的api文件user.js。在编辑器敲击 ```node ``` 出现提示，确认回车，生成代码模板，保存后运行服务。

## 部署

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
            - 5000:5000 
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
   - 若无报错运行```docker ps```可查看所有运行的容器
  

