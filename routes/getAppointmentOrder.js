/*
 * @Date: 2020-07-30 18:44:10
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-30 18:44:10
 * @FilePath: \server\routes\getAppointmentOrder.js
 */ 
const express = require('express');
const axios = require('axios')
const mongoose = require('mongoose')
const router = express.Router();
const {  } = require('../model/index')


router.get('/',((req,res,next) => {
   res.json()
}))

module.exports = router;