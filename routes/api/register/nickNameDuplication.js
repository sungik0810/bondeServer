const express = require('express')
const router = express.Router()
const User = require('../../../models/UserModel')
router.post('/nickNameDuplication', async (req, res) => {
  const userInput = req.body.nickName
  const nickName = await User.find({ nickName: userInput })
  if (nickName.length > 0) {
    res.json(true)
  } else {
    res.json(false)
  }
})

module.exports = router
