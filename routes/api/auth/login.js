const express = require('express')
const router = express.Router()
const User = require('../../../models/UserModel')
const bcrypt = require('bcrypt')
async function comparePassword(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword)
  return isMatch
}

router.post('/login', async (req, res) => {
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
      return res.json({ state: true })
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
