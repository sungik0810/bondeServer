const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema(
  {
    TOS: { type: Array, requierd: true },
    email: { type: String, required: true },
    password: { type: String, required: false },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    nickName: { type: String, required: true },
    birth: { type: String, required: true },
    gender: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('user', UserSchema)
