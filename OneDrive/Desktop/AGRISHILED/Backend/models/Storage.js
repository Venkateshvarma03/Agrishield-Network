const mongoose = require("mongoose");

const storageSchema = new mongoose.Schema({
  name: String,
  distance: String,
  capacity: String,
  type: String,
  available: { type: Boolean, default: true },
});

module.exports = mongoose.model("Storage", storageSchema);