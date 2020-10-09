/*
 * @Date: 2020-07-30 15:54:19
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-31 15:53:17
 * @FilePath: \server\routes\patient.js
 */
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();

const { patientModel } = require('../model/index') //引入的模型名称根据你的model文件定义的格式来

//查找
router.get('/patient',((req,res,next) => {
   const { id } = req.query
   id ? patientModel.findById(id).exec((err,patient)=>res.json(patient))
   :patientModel.find().exec((err,patients)=>res.json(patients))
}))

//增加
router.post('/patient',((req,res,next) => {
   const patient = new patientModel(req.body)
   patient.save((err,saved)=>res.json(saved))
}))

router.post('/', ((req, res, next) => {
    const { user_id, patient_name, patient_card_id, sex } = req.body
    patientInfo = {
        patient_name,
        patient_card_id,
        sex
    }
    const newPatient = new Patient(patientInfo)
    newPatient.save()
    User.findOneAndUpdate(
        { _id: user_id },
        {
            $addToSet: {
                patient_list: patientInfo
            }
        },
        { new: true },
        (err, user) => {
            res.json(user)
        }
    )
}))

//删除
router.delete('/patient',((req,res,next) => {
   const {id} = req.body
   patientModel.findByIdAndRemove(id,(err,removed)=>res.json(removed))
}))

//修改
router.put('/patient',((req,res,next) => {
   const {id} = req.body
   patientModel.findByIdAndUpdate(id,{...req.body},{new:true},(err,updated)=>res.json(updated))
}))

module.exports = router;