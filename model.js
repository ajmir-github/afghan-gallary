import mongoose from "mongoose"

// Model
const postSchema = new mongoose.Schema({
 title:{
  type:String,
  required:true
 },
 keywords:{
  type:String,
  required:true
 },
 email:{
  type:String,
  required:true
 },
 location:{
  type:String,
  required:true
 },
 photographer:{
  type:String,
  required:true
 },
 image:{
  sm:{
   type:String,
   required:true
  },
  lg:{
   type:String,
   required:true
  }
 },
 date:{
  type:Date,
  default: Date.now
 },
 liked:{
  type:Number,
  default:0
 }
})


export const postModel = mongoose.model("posts", postSchema)
