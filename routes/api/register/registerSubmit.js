const express = require('express')
const router = express.Router()
const User = require('../../../models/UserModel')
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../../../config/config')
async function hashPassword(password) {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

router.post('/submit', async (req, res) => {
  const KST_OFFSET = 9 * 60 * 60 * 1000
  const kstNow = new Date(Date.now() + KST_OFFSET)
  const year = kstNow.getUTCFullYear().toString()
  const month = (kstNow.getUTCMonth() + 1).toString().padStart(2, '0')
  const date = kstNow.getUTCDate().toString().padStart(2, '0')
  const hour = kstNow.getUTCHours().toString().padStart(2, '0')
  const minute = kstNow.getUTCMinutes().toString().padStart(2, '0')
  const postDate = `${year}-${month}-${date}`
  const postTime = `${hour}:${minute}`
  const userIpAddress =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const JWT_PRIVATE_KEY = jwtConfig.JWT_PRIVATE_KEY
  const userTOS = req.body.TOS
  const userEmail = req.body.email
  const userPassword = await hashPassword(req.body.password)
  const userPhone = req.body.phone
  const userName = req.body.name
  const userNickName = req.body.nickName
  const userBirth = req.body.birth
  const userGender = req.body.gender
  const logTextSuccess = `POST | register/submit |${postDate} ${postTime} / userIp:${userIpAddress} userEmail:${userEmail} register : Success`
  const logTextFail = `POST | register/submit |${postDate} ${postTime} / userIp:${userIpAddress} userEmail:${userEmail} register : Fail`
  const token = jwt.sign(
    { data: { email: userEmail, name: userName, nickName: userNickName } },
    JWT_PRIVATE_KEY,
    {
      expiresIn: '60d',
    }
  )

  const user = new User({
    TOS: userTOS,
    email: userEmail,
    password: userPassword,
    phone: userPhone,
    name: userName,
    nickName: userNickName,
    birth: userBirth,
    gender: userGender,
    refreshToken: token,
  })
    .save()
    .then((result) => {
      logger.info(logTextSuccess)
      return res.json('success')
    })
    .catch((err) => {
      logger.info(logTextFail)
      return res.json('fail')
    })
})

module.exports = router
