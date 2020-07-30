/*
 * @Date: 2020-07-30 15:54:19
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-30 18:49:23
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
    let { user_id, patient_name, patient_card_id, sex } = req.body
    patientInfo = {
        patient_name,
        patient_card_id,
        sex
    }
    const newPatient = new Patient(patientInfo)
    // newPatient.save()
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

router.delete('/', ((req, res) => {
    const { user_id } = req.body
    User.findByIdAndRemove({ _id: user_id }).exec(err=>{
        User.find((err,restUser)=>{
            res.json(restUser)
        })
    })

}))

module.exports = router;