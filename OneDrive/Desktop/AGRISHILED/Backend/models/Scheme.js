const mongoose = require("mongoose");

const schemeSchema = new mongoose.Schema({
  iconName: String,
  title: String,
  titleColor: String,
  description: String,
  subDescription: String,
  linkText: String,
  cardBg: String,
});

module.exports = mongoose.model("Scheme", schemeSchema);