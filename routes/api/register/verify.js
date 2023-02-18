const express = require('express')
const router = express.Router()
const Cache = require('memory-cache')
const logger = require('../../../controllers/logger')
require('dotenv').config()

router.post('/verify', async (req, res) => {
  const KST_OFFSET = 9 * 60 * 60 * 1000
  const kstNow = new Date(Date.now() + KST_OFFSET)
  const year = kstNow.getUTCFullYear().toString()
  const month = (kstNow.getUTCMonth() + 1).toString().padStart(2, '0')
  const date = kstNow.getUTCDate().toString().padStart(2, '0')
  const hour = kstNow.getUTCHours().toString().padStart(2, '0')
  const minute = kstNow.getUTCMinutes().toString().padStart(2, '0')
  const postDate = `${year}-${month}-${date}`
  const postTime = `${hour}:${minute}`

  const userPhoneNum = req.body.phoneNum.value.slice(0, 11)
  const userOuthInputNum = req.body.phoneOuthNum.value
  const currentOuthNum = Cache.get(userPhoneNum)
  const userIpAddress =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const logText = `POST | register/verify |${postDate} ${postTime} / userIp:${userIpAddress} userPhoneNum:${userPhoneNum} userOuthInputNum : ${userOuthInputNum} currentOuthNum:${currentOuthNum}`
  logger.info(logText)

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
