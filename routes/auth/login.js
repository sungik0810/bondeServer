const express = require("express");
const app = express();
const router = express.Router();

router.get("/login", (req, res) => {
  //   db.collection("user")
  //     .find({ listUp: { $eq: 1 } })
  //     .toArray((error, result) => {
  //       if (error) return console.log(error);

  //       res.send(result);
  //     });
  console.log(req.query);
  const userId = req.query.userId;
  const userPassword = req.query.userPassword;
  console.log(userId, userPassword);
  res.send("hi");
});

module.exports = router;
