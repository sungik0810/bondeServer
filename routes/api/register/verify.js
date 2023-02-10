const { default: axios } = require('axios')
const express = require('express')
const moment = require('moment')
const { sens } = require('../../../config/config')
const { verifyItem } = require('../../../controllers/util')
const router = express.Router()
const Cache = require('memory-cache')
// router.use(express.json())
require('dotenv').config()
const SENS_SERVICEID = process.env.SENS_SERVICEID

router.post('/verify', async (req, res) => {
  const userPhoneNum = req.body.phoneNum.value.slice(1, 11)
  const userOuthInputNum = req.body.phoneOuthNum.value
  console.log('userPhoneNum', userPhoneNum)
  console.log(Cache.get(userPhoneNum))
  const currentOuthNum = Cache.get(userPhoneNum)
  console.log(currentOuthNum)
  if (currentOuthNum === null) {
    return res.json({ timeLimit: true })
  }

  if (currentOuthNum === userOuthInputNum) {
    return res.json({ timeLimit: false, state: true })
  } else {
    return res.json({ timeLimit: false, state: false })
  }
})

module.exports = router
