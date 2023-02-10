const express = require('express')
const router = express.Router()
// router.use(express.json())
const User = require('../../../models/UserModel')
router.post('/emailDuplication', async (req, res) => {
  const userInput = req.body.email
  const email = await User.find({ email: userInput })
  if (email.length > 0) {
    res.json(true)
  } else {
    res.json(false)
  }
  // console.log(email)
})

module.exports = router
