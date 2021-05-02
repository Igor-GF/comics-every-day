const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { 
    type: String,
    trim: true,
    require: true, 
  },
  email: { 
    type: String,
    unique: true,
    lowercase: true,
    require: true,  
  },
  password: { 
    type: String,
    require: true, 
  },
  profilePicUrl: { type: String },
  readComics: [{ type: Schema.Types.ObjectId, ref:"ComicBook" }],
  wishedComics: [{ type: Schema.Types.ObjectId, ref:"ComicBook" }],
})

module.exports = model("User", userSchema);