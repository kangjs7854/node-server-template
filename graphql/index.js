/*
 * @Date: 2020-08-19 16:21:10
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-19 16:21:19
 * @FilePath: \server\graphql\index.js
 */
const express = require('express')
const expressGraphql = require('express-graphql')
const app = express()
// 配置路由
app.use('/graphql', expressGraphql(req => {
  return {
    schema: require('./graphql/schema'), // graphql相关代码主目录
    graphiql: true // 是否开启可视化工具
    // ... 此处还有很多参数，为了简化文章，此处就一一举出, 具体可以看 刚才开篇提到的 express文档,
    // 也可以在文章末尾拉取项目demo进行查阅
  }
}))
// 服务使用3000端口
app.listen(5000, () => {
  console.log("graphql server is ok");
});