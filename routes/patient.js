/*
 * @Date: 2020-07-30 15:54:19
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-31 10:03:19
 * @FilePath: \server\routes\getPatient.js
 */
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();
const { User, Patient } = require('../model/index')

router.get('/', ((req, res, next) => {
    Patient.find((err, allPatient) => {
        res.json(allPatient)
    })
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



router.delete('/',(req,res)=>{
    const { patient_id } = req.query

})

module.exports = router;