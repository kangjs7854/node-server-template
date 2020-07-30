/*
 * @Date: 2020-07-29 18:36:52
 * @LastEditors: kjs
 * @LastEditTime: 2020-07-29 18:39:45
 * @FilePath: \server\routes\getClinicGuide.js
 */
const express = require('express');
const router = express.Router();

router.post('/', ((req, res, next) => {
    const { patient_id, order_id } = req.body
    
    res.json()
}))

module.exports = router;