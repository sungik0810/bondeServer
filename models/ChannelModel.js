const mongoose = require('mongoose')
const ChannelSchema = new mongoose.Schema(
  {
    channels: { type: Object, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('channel', ChannelSchema)
