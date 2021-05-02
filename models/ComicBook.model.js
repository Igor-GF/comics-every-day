const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const comicBookSchema = new Schema({
  title: { 
    type: String,
    unique: true,
    require: true, 
  },
  writer: { 
    type: String,
    unique: true,
    require: true,  
  },
  publisher: { 
    type: String,
    require: true, 
  },
  coverUrl: { type: String },
  rates: [{ type: Schema.Types.ObjectId, ref:"Review"}],
})

module.exports = model("ComicBook", comicBookSchema);