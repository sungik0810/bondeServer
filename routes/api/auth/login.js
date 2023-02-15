const express = require('express')
const router = express.Router()
const User = require('../../../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../../../config/config')

async function comparePassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  return isMatch
}

router.post('/login', async (req, res) => {
  const JWT_PRIVATE_KEY = jwtConfig.JWT_PRIVATE_KEY
  const userEmail = req.body.userData.email
  const user = await User.find({ email: userEmail })
  if (user.length >= 1) {
    const userPassword = await comparePassword(
      req.body.userData.password,
      user[0].password
    )
    if (userPassword) {
      //login
      //jwt 생성
      const refreshToken = user[0].refreshToken
      // const token = jwt.sign({ data: userEmail }, JWT_PRIVATE_KEY, {
      //   expiresIn: '1h',
      // })
      const verify = jwt.verify(
        refreshToken,
        JWT_PRIVATE_KEY,
        function (err, decoded) {
          if (err)
            return res.json({ state: false, message: 'refreshToken err' })
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
            return res.json({ state: true, token: accessToken })
          }
        }
      )
    } else if (!userPassword) {
      //password wrong
      return res.json({ state: false, num: 1 })
    }
  } else if (user.length < 1) {
    // not found
    return res.json({ state: false, num: 0 })
  }
})

module.exports = router
