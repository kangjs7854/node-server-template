/*
 * @Date: 2020-07-30 11:52:11
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-31 18:46:30
 * @FilePath: \server\model\index.js
 */
const mongoose = require("mongoose")
//定义模式的属性和行为

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
    appointmentStep: [appointmentStepSchema]
})

const patientSchema = mongoose.Schema({
    patient_name: String,
    patient_card_id: Number,
    sex: String,
    appoinent_order: [appointmentOrderSchema]
})

const userInfoSchema = mongoose.Schema({
    name: String,
    patient_list: [patientSchema]
})

const testSchema = mongoose.Schema({
    name: String
})


//通过模式生成模型
const userInfoModel = mongoose.model("User", userInfoSchema)
const patientModel = mongoose.model("Patient", patientSchema)
const appointmentOrderModel = mongoose.model('AppointmentOrder', appointmentOrderSchema)
const appointmentStepModel = mongoose.model("AppointmentStep", appointmentStepSchema)
const testModel = mongoose.model("Test", testSchema)



module.exports = {
    userInfoModel,
    patientModel,
    appointmentOrderModel,
    appointmentStepModel,
    testModel
}