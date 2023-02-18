const express = require('express')
const router = express.Router()
const User = require('../../../models/UserModel')
require('dotenv').config()
const { sendVerificationSMS } = require('../../../controllers/util')
const Cache = require('memory-cache')
const logger = require('../../../controllers/logger')
router.post('/send', async (req, res) => {
  const KST_OFFSET = 9 * 60 * 60 * 1000
  const kstNow = new Date(Date.now() + KST_OFFSET)
  const year = kstNow.getUTCFullYear().toString()
  const month = (kstNow.getUTCMonth() + 1).toString().padStart(2, '0')
  const date = kstNow.getUTCDate().toString().padStart(2, '0')
  const hour = kstNow.getUTCHours().toString().padStart(2, '0')
  const minute = kstNow.getUTCMinutes().toString().padStart(2, '0')
  const postDate = `${year}-${month}-${date}`
  const postTime = `${hour}:${minute}`

  const userPhoneNum = req.body.phoneNum.value
  const userPhoneNumFront = userPhoneNum.slice(0, 3)
  const deviceId = req.body.deviceId
  const userIpAddress =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const logText = `POST | register/send |${postDate} ${postTime} / userIp:${userIpAddress} userPhoneNum:${userPhoneNum} deviceId : ${deviceId}`
  logger.info(logText)
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
        logger.info(logText + ' try : 0')
        return sendVerificationSMS(req, res)
      }
    }

    if (deviceIdCache !== null) {
      if (deviceIdCache[deviceId] > 1) {
        logger.error(logText + ` try : ${deviceIdCache[deviceId] + 1}`)
        return res.json({ duplication: false, limit: true })
      } else if (deviceIdCache[deviceId] <= 1 && userPhoneNumFront == '010') {
        logger.info(logText + ` try : ${deviceIdCache[deviceId] + 1}`)
        return sendVerificationSMS(req, res)
      }
    }
  }
})

module.exports = router
