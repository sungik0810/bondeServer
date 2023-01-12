const express = require('express')
const app = express()
const router = express.Router()

router.get('/content', (req, res) => {
  db.collection('contentServerData')
    .find({})
    .sort({ number: -1 })
    .toArray((error, result) => {
      if (error) return console.log(error)
      res.send(result)
    })

  // res.send(db.collection("store_list").find());
})

module.exports = router
