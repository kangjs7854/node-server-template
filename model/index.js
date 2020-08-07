/*
 * @Date: 2020-07-30 11:52:11
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-07 11:32:58
 * @FilePath: \server\model\index.js
 */
const mongoose = require("mongoose")
//定义模式的属性和行为

//联表时用于标志存储数据的唯一性
const ObjectId = mongoose.Schema.Types.ObjectId;

const appointmentStepSchema = mongoose.Schema({
    type: String,
    status: Number
})

const appointmentOrderSchema = mongoose.Schema({
    doctor_name: String,
    appoinent_time: Date,
    appoinent_department: String,
    price: Number,
    currentStep: Number,
    appointmentStep: {
        type: ObjectId,
        ref: "AppointmentStep"
    }
})

const patientSchema = mongoose.Schema({
    patient_name: String,
    patient_card_id: Number,
    sex: String,
    appoinent_order: {
        type: ObjectId,
        ref: "AppointmentOrder"
    }
})

const userInfoSchema = mongoose.Schema({
    name: String,
    accountInfo: String,
    timestamp: Number,
    loginToken: String,
    patient_list: {
        type: ObjectId,
        ref: "Patient"
    },
    extendData: {
        data: String
    }
})

const memberInfoSchema = mongoose.Schema({
    isDefault: Boolean,
    memberName: String,
    memberSex: String,
    cardInfo: {
        type: ObjectId,
        ref: "Card"
    },
    limitMember:Number

})

const cardSchema = mongoose.Schema({
    cardNo: String,
    cardType: String,
    cardName: String
})

const testSchema = mongoose.Schema({
    name: String
})

const hosSchema = mongoose.Schema({
    unitId: Number,
    unitName: String,
    unitImg: String,
    timestamp: Number,
    exentdData: {
        data: String
    }
})

//联表测试
const orderSchema = mongoose.Schema({
    price: Number,
    buyer: {
        type: ObjectId,
        ref: "UserTest"//注意这里的ref指向生成模型的类
    }
})
const userSchema = mongoose.Schema({
    username: String
})

const orderModel = mongoose.model("OrderTest", orderSchema)
const userModel = mongoose.model("UserTest", userSchema)



//通过模式生成模型
const userInfoModel = mongoose.model("User", userInfoSchema)
const patientModel = mongoose.model("Patient", patientSchema)
const appointmentOrderModel = mongoose.model('AppointmentOrder', appointmentOrderSchema)
const appointmentStepModel = mongoose.model("AppointmentStep", appointmentStepSchema)
const testModel = mongoose.model("Test", testSchema)

const hosModel = mongoose.model("Hos", hosSchema)
const memberInfoModel = mongoose.model("MemberInfo", memberInfoSchema)
const cardModel = mongoose.model("Card", cardSchema)

module.exports = {
    userInfoModel,
    patientModel,
    appointmentOrderModel,
    appointmentStepModel,
    testModel,

    orderModel,
    userModel,

    hosModel,
    memberInfoModel,
    cardModel
}