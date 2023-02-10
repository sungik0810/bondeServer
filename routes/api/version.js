const express = require('express')
const router = express.Router()
const Version = require('../../models/VersionModel')
router.get('/version', async (req, res) => {
  const versions = await Version.find()
  res.json(versions[0].version)
})

module.exports = router
