const express = require("express");
const app = express();
const router = express.Router();

router.get("/storelist/:youtuberName", (req, res) => {
  const youtuberName = req.params.youtuberName;
  db.collection("store_list")
    .find({ listUp: { $eq: 1 }, youtuberName: { $eq: youtuberName } })
    .sort({ number: -1 })
    .toArray((error, result) => {
      if (error) return console.log(error);

      res.send(result);
    });

  // res.send(db.collection("store_list").find());
});

module.exports = router;
