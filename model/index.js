/*
 * @Date: 2020-07-30 11:52:11
 * @LastEditors: kjs
 * @LastEditTime: 2020-08-18 18:15:53
 * @FilePath: \server\model\index.js
 */
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Model = mongoose.model
//联表时用于标志存储数据的唯一性
const ObjectId = Schema.Types.ObjectId;


//定义模式的属性和行为

const appointmentStepSchema = Schema({
    type: String,
    status: Number
})

const appointmentOrderSchema = Schema({
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

const patientSchema = Schema({
    patient_name: String,
    patient_card_id: Number,
    sex: String,
    appoinent_order: {
        type: ObjectId,
        ref: "AppointmentOrder"
    }
})

const userInfoSchema = Schema({
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

const memberInfoSchema = Schema({
    isDefault: Boolean,
    memberName: String,
    memberSex: String,
    cardInfo: {
        type: ObjectId,
        ref: "Card"
    },
    limitMember: Number,
    orders: [
        {
            type: ObjectId,
            ref: "OrderList"
        }
    ]


})

const cardSchema = Schema({
    cardNo: String,
    cardType: String,
    cardName: String
})

const testSchema = Schema({
    name: String,
    age: Number,
    url: String
})

const hosSchema = Schema({
    unitId: Number,
    unitName: String,
    unitImg: String,
    timestamp: Number,
    exentdData: {
        data: String
    }
})

const orderListSchema = Schema({
    depName: String,
    doctorName: String,
    takeNo: Number,
    clinicTime: String,
    payAmt: String,
    doctorId: Number,
    depId: Number,
    userName: String
})

const orderStatusSchema = Schema({
    orderNo: {
        type: ObjectId,
        ref: "OrderList"
    },
    currentStatus: String,
    reservationStatus: Number,
    signStatus: Number,
    examinePayStatus: Number,
    examineStatus: Number,
    reportStatus: Number,
    outpatientPayStatus: Number,
    medicineStatus: Number
})


//联表测试
const orderSchema = Schema({
    price: Number,
    buyer: {
        type: ObjectId,
        ref: "UserTest"//注意这里的ref指向生成模型的类
    }
})
const userSchema = Schema({
    username: String
})

const orderModel = Model("OrderTest", orderSchema)
const userModel = Model("UserTest", userSchema)



//通过模式生成模型
const userInfoModel = Model("User", userInfoSchema)
const patientModel = Model("Patient", patientSchema)
const appointmentOrderModel = Model('AppointmentOrder', appointmentOrderSchema)
const appointmentStepModel = Model("AppointmentStep", appointmentStepSchema)
const testModel = Model("Test", testSchema)

const hosModel = Model("Hos", hosSchema)
const memberInfoModel = Model("MemberInfo", memberInfoSchema)
const cardModel = Model("Card", cardSchema)
const orderListModel = Model("OrderList", orderListSchema)
const orderStatusModel = Model("OrderStatus", orderStatusSchema)


class quicklyMockModel{
    constructor(ModelName,schema){
        this.Schema = mongoose.Schema(schema)
        this.Model = mongoose.model(ModelName,this.Schema)
    }
}

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
    cardModel,
    orderListModel,
    orderStatusModel,

    quicklyMockModel
}