
# node-server-template

node开发接口的项目模板，通过封装以及vscode自定义代码块的功能，只需传入所需的数据字段，快速生成restful风格的api

# 项目结构
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


- ## 生成代码模板
1. 键盘F1打开顶部搜索栏，输入以下命令行
```
configure user snippets

```
2. 点击选择后，输入并点击
```
javascript.json

```
3. 自定义的代码块模板
```
{
	"Print to console": {
		"prefix": "node",
		"body": [
			"const express = require('express');",
			"const router = express.Router();",
			"const mongoose = require('mongoose')",
			"const ObjectId = mongoose.Schema.Types.ObjectId; //联表时用于标志存储数据的唯一性",
			"",
			"const { quicklyMockModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来",
			"const Controller = require('../controllers/index');",
			"//快速mock数据，生成数据模型",
			"const ${TM_FILENAME_BASE} = new quicklyMockModel('${TM_FILENAME_BASE}',{",
			"    name:String,",
			"    age:Number",
			"})",
			"//传入该模型生成控制器",
			"const ${TM_FILENAME_BASE}Controller = new Controller(${TM_FILENAME_BASE}.Model)",
			"",
			"//查找",
			"router.get('/${TM_FILENAME_BASE}', async(req, res, next) => {",
			"   const { id } = req.query",
			"   const ${TM_FILENAME_BASE} = await ${TM_FILENAME_BASE}Controller.find({ _id: id })",
			"   res.json(${TM_FILENAME_BASE})",
			"})",
			"",
			"//增加 || 更新",
			"router.post('/${TM_FILENAME_BASE}', async(req,res,next) => {",
			"   const { id, name } = req.body",
			"   const query = { name } //匹配条件,根据什么字段进行插入或者更新,这里使用nama字段为条件",
			"   const payload = { ...req.body } //内容",
			"",
			"   const data = await ${TM_FILENAME_BASE}Controller.insert(query, payload)",
			"   res.json(data)",
			"})",
			"",
			"//删除",
			"router.delete('/${TM_FILENAME_BASE}', async(req,res,next) => {",
			"   const { id } = req.body",
			"   const data = await ${TM_FILENAME_BASE}Controller.remove(id)",
			"   res.json(data)",
			"})",
			"",
			"//修改",
			"router.put('/${TM_FILENAME_BASE}', async(req,res,next) => {",
			"   const { id } = req.body",
			"  const data = await ${TM_FILENAME_BASE}Controller.update({ _id: id }, { ...req.body })",
			"   res.json(data)",
			"})",
			"",
			"module.exports = router;"
		],
		"description": "Log output to console"
	}
}
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
  

