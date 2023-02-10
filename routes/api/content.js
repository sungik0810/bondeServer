const express = require('express')
const router = express.Router()
const Store = require('../../models/StoreModel')
router.get('/content', async (req, res) => {
  const stores = await Store.find().sort({ dataNumber: 1 })
  res.json(stores)
})

module.exports = router
