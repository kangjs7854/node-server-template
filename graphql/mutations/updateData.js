/*
 * @Date: 2020-08-19 16:22:28
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-19 16:23:29
 * @FilePath: \server\graphql\mutations\updateData.js
 */
const {
    GraphQLInt
  } = require('graphql')
  
  let count = 0
  
  module.exports = {
    type: GraphQLInt,  // 定义返回的数据类型
    description: '修改例子',
    args: {  // 定义传参的数据结构
      num: {
        type: GraphQLInt,
        description: '数量'
      }
    },
    resolve: (root, params) => {
      let { num } = params
      count += num
      return count
    }
  }