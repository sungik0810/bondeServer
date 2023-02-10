const mongoose = require('mongoose')
const StoreSchema = new mongoose.Schema(
  {
    dataNumber: { type: Number, required: true },
    listing: { type: Boolean, required: true },
    state: { type: Number, required: false },
    country: { type: Number, required: false },
    sectors: { type: String, required: false },
    logo: { type: String, required: false },
    name: { type: String, required: true },
    address: { type: String, required: false },
    openTime: { type: String, required: false },
    breakTime: { type: String, required: false },
    lastOrderTime: { type: String, required: false },
    closed: { type: String, required: false },
    contact: { type: String, required: false },
    channelName: { type: String, required: true },
    thumbnail: { type: String, required: true },
    link: { type: String, required: true },
    title: { type: String, required: true },
    onAir: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Store', StoreSchema)
