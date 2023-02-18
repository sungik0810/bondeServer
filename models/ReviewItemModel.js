const mongoose = require('mongoose')
const ReviewItemSchema = new mongoose.Schema(
  {
    dataNumber: { type: Number, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    userNickName: { type: String, required: true },
    reviewUuid: { type: String, required: true },
    reviewText: { type: String, required: true },
    reviewImage: { type: String, required: true },
    postDate: { type: String, required: true },
    postTime: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('ReviewItem', ReviewItemSchema)
