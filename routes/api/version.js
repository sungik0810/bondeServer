const express = require('express')
const app = express()
const router = express.Router()

router.get('/version', (req, res) => {
  db.collection('version')
    .find({})
    .toArray((error, result) => {
      if (error) return res.send(error)

      res.send(result[0].version)
    })
})

module.exports = router
