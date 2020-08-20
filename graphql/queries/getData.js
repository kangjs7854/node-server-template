const {
    GraphQLID,
    GraphQLInt,
    GraphQLFloat,
    GraphQLString,
    GraphQLBoolean,
    GraphQLNonNull,
    GraphQLObjectType
  } = require('graphql')
  // 定义接口返回的数据结构
  const userType = new GraphQLObjectType({
    name: 'userItem',
    description: '用户信息',
    fields: () => ({
      id: {
        type: GraphQLID,
        description: '数据唯一标识'
      },
      username: {
        type: GraphQLString,
        description: '用户名'
      },
      age: {
        type: GraphQLInt,
        description: '年龄'
      },
      height: {
        type: GraphQLFloat,
        description: '身高'
      },
      isMarried: {
        type: GraphQLBoolean,
        description: '是否已婚',
        deprecationReason: "这个字段现在不需要了"
      }
    })
  })
  // 定义接口
  module.exports = {
    type: userType,
    description: 'object类型数据例子',
    // 定义接口传参的数据结构
    args: {
      isReturn: {
        type: new GraphQLNonNull(GraphQLBoolean),
        description: '是否返回数据'
      }
    },
    resolve: (root, params, context) => {
      const { isReturn } = params
      if (isReturn) {
        // 返回的数据与前面定义的返回数据结构一致
        return {
          "id": "5bce2b8c7fde05hytsdsc12c",
          "username": "Davis",
          "age": 23,
          "height": 190.5,
          "isMarried": true
        }
      } else {
        return null
      }
    }
  }