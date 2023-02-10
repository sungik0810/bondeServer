const express = require('express')
const router = express.Router()
const Channel = require('../../models/ChannelModel')
router.get('/channel', async (req, res) => {
  const channels = await Channel.find()
  res.json(channels)
})

module.exports = router
