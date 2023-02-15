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
  const JWT_PRIVATE_KEY = jwtConfig.JWT_PRIVATE_KEY
  const userTOS = req.body.TOS
  const userEmail = req.body.email
  const userPassword = await hashPassword(req.body.password)
  const userPhone = req.body.phone
  const userName = req.body.name
  const userNickName = req.body.nickName
  const userBirth = req.body.birth
  const userGender = req.body.gender
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
      return res.json('success')
    })
    .catch((err) => {
      return res.json('fail')
    })
})

module.exports = router
