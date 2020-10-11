
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Model = mongoose.model
//联表时用于标志存储数据的唯一性
const ObjectId = Schema.Types.ObjectId;

//api列表的模式
const apiListSchema = Schema({
    method: String,
    apiName: String,
    dataSource: [
        {
            id: String,
            key: String,
            value: String,
            unique: Boolean,
            type: {
                type: String
            },
            children: [{
                id: String,
                key: String,
                value: String,
                type: {
                    type: String
                },
                isInner: Boolean
            }],
            test: String
        }
    ],
})

const userSchema = Schema({
    name:String,
    url:String,
    avatar_url:String,
    isAdmin:Boolean
})


//api列表的模型
const apiListModel = Model('ApiList', apiListSchema)
const userModel = Model('User',userSchema)

module.exports = {
    apiListModel,
    userModel
}