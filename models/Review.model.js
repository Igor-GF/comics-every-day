const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reviewSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref:"User"},
  rate: { type: Number, require: true },
  comment: { type: String, maxLength: 200 }
})

module.exports = model("Review", reviewSchema);