const express = require("express");
const app = express();
const router = express.Router();

router.get("/youtubelist/:storeName", (req, res) => {
  const storeName = req.params.storeName;
  db.collection("store_list")
    .find({ storeName: { $eq: storeName } })
    .sort({ number: 1 })
    .toArray((error, result) => {
      if (error) return console.log(error);

      res.send(result);
    });

  // res.send(db.collection("store_list").find());
});

module.exports = router;
