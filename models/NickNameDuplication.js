const mongoose = require('mongoose')
const NickNameSchema = new mongoose.Schema(
  {
    nickName: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('nickName', NickNameSchema)
