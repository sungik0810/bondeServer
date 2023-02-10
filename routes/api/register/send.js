const express = require('express')
const router = express.Router()
const User = require('../../../models/UserModel')
require('dotenv').config()
const { sendVerificationSMS } = require('../../../controllers/util')
const Cache = require('memory-cache')
router.post('/send', async (req, res) => {
  const userPhoneNum = req.body.phoneNum.value
  const userPhoneNumFront = userPhoneNum.slice(0, 3)
  console.log(typeof userPhoneNumFront)
  const deviceId = req.body.deviceId

  const deviceIdCache = Cache.get('deviceVerify')

  const user = await User.find({ phone: userPhoneNum })
  if (user.length > 0) {
    return res.json({ duplication: true, limit: false })
  } else {
    if (deviceIdCache === null || deviceIdCache[deviceId] == null) {
      Cache.put('deviceVerify', { ...deviceIdCache, [deviceId]: 0 })
    } else {
      Cache.put('deviceVerify', {
        ...deviceIdCache,
        [deviceId]: deviceIdCache[deviceId] + 1,
      })
    }

    if (deviceIdCache == null) {
      if (userPhoneNumFront == '010') {
        console.log('test1')
        return sendVerificationSMS(req, res)
      }
    }

    if (deviceIdCache !== null) {
      if (deviceIdCache[deviceId] > 1) {
        return res.json({ duplication: false, limit: true })
      } else if (deviceIdCache[deviceId] <= 1 && userPhoneNumFront == '010') {
        console.log('test2')
        return sendVerificationSMS(req, res)
      }
    }
  }
})

module.exports = router
