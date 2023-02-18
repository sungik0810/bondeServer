const express = require('express')
const router = express.Router()
const User = require('../../../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../../../config/config')
const logger = require('../../../controllers/logger')
async function comparePassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  return isMatch
}

router.post('/login', async (req, res) => {
  const KST_OFFSET = 9 * 60 * 60 * 1000
  const kstNow = new Date(Date.now() + KST_OFFSET)
  const year = kstNow.getUTCFullYear().toString()
  const month = (kstNow.getUTCMonth() + 1).toString().padStart(2, '0')
  const date = kstNow.getUTCDate().toString().padStart(2, '0')
  const hour = kstNow.getUTCHours().toString().padStart(2, '0')
  const minute = kstNow.getUTCMinutes().toString().padStart(2, '0')
  const postDate = `${year}-${month}-${date}`
  const postTime = `${hour}:${minute}`

  const JWT_PRIVATE_KEY = jwtConfig.JWT_PRIVATE_KEY
  const userEmail = req.body.userData.email
  const user = await User.find({ email: userEmail })
  const userIpAddress =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const logText = `POST | auth/login |${postDate} ${postTime} / userIp:${userIpAddress} userEmail:${userEmail} state : try`
  const logTextSuccess = `POST | auth/login |${postDate} ${postTime} / userIp:${userIpAddress} userEmail:${userEmail} state : success`
  const logTextFail = `POST | auth/login |${postDate} ${postTime} / userIp:${userIpAddress} userEmail:${userEmail} state : fail`
  logger.info(logText)
  if (user.length >= 1) {
    const userPassword = await comparePassword(
      req.body.userData.password,
      user[0].password
    )
    if (userPassword) {
      //login
      const refreshToken = user[0].refreshToken
      const verify = jwt.verify(
        refreshToken,
        JWT_PRIVATE_KEY,
        function (err, decoded) {
          if (err) {
            logger.info(logTextFail + ' issue : refreshToken err')
            return res.json({ state: false, message: 'refreshToken err' })
          }
          if (decoded) {
            const accessToken = jwt.sign(
              {
                data: {
                  email: userEmail,
                  name: user[0].name,
                  nickName: user[0].nickName,
                },
              },
              JWT_PRIVATE_KEY,
              {
                expiresIn: '1d',
              }
            )
            logger.info(logTextSuccess)
            return res.json({ state: true, token: accessToken })
          }
        }
      )
    } else if (!userPassword) {
      //password wrong
      logger.info(logTextFail + ' issue : password wrong')
      return res.json({ state: false, num: 1 })
    }
  } else if (user.length < 1) {
    // not found
    logger.info(logTextFail + ' issue : not found')
    return res.json({ state: false, num: 0 })
  }
})

module.exports = router
