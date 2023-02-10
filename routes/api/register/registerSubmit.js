const express = require('express')
const router = express.Router()
const User = require('../../../models/UserModel')
require('dotenv').config()
const bcrypt = require('bcrypt')
const HASH_PASSWORD = process.env.HASH_PASSWORD
const SENS_SERVICEID = process.env.SENS_SERVICEID

async function hashPassword(password) {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

router.post('/submit', async (req, res) => {
  const userTOS = req.body.TOS
  const userEmail = req.body.email
  const userPassword = await hashPassword(req.body.password)
  const userPhone = req.body.phone
  const userName = req.body.name
  const userNickName = req.body.nickName
  const userBirth = req.body.birth
  const userGender = req.body.gender
  console.log(req.body)

  //password bcrypt
  console.log(userPassword)
  // const compare = await comparePassword(userPassword, hashedPassword)
  // console.log(compare)

  const user = new User({
    TOS: userTOS,
    email: userEmail,
    password: userPassword,
    phone: userPhone,
    name: userName,
    nickName: userNickName,
    birth: userBirth,
    gender: userGender,
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
// email: { type: String, required: true },
// password: { type: String, required: false },
// phone: { type: String, required: true },
// name: { type: String, required: true },
// nickName: { type: String, required: true },
// birth: { type: String, required: true },
// gender: { type: String, required: true },
