## 技术栈
- [x] typescript  
- [x] express   
- [x] routing-contrller  
- [x] mongodb  
- [x] docker  

## 安装依赖
 ```yarn install```

## 运行
```yarn dev```

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
  

