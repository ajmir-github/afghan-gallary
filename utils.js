// imports
import mongoose from "mongoose"
import fs from "fs"
import Jimp from "jimp"
import { v4 } from "uuid"

// Database connector
export default function database(
  DATABASE_URL = "mongodb://localhost:27017/test",
  onSuccessCallBack = ()=> {},
  onErrorCallBack = ()=> {}
) {

 // Database Connection
 mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
 })

 // log database connection status
 mongoose.connection
  .on("error", ()=> {
    console.log("+++ Connection to the database failed!")
    onErrorCallBack()
  })
  .on("open", ()=> {
    console.log("--- Connected to the database")
    onSuccessCallBack()
  })

}


// deleteFile
export const deleteFile = (fileName, throwError =  false) => {
 return new Promise(async(resolve, reject)=>{
  fs.unlink(fileName, (err)=>{
   if(err && throwError) reject({message:"Failed to delete!", error:err})
   if(err){
    resolve("Failed to delete!")
   } else {
    resolve("Deleted!")
   }
  })
 })
}

// deleteFiles
export const deleteFiles = (fileNames, throwError =  false) => {
  return Promise.all(
    fileNames.map(fileName => deleteFile(fileName, throwError))
  )
}


// Read, resize and make the image better and save it in a new path
export const resizeImage = (exFilePath, newFilePath, size = {h:240, w:360}, quality = 60, contrast = 0.05) => {
 return new Promise(async(resolve, reject)=>{
  try {
   const imgFile = await Jimp.read(exFilePath)
   imgFile
   .cover(size.w, size.h)
   .quality(quality)
   .contrast(contrast)
   .write(newFilePath, (err)=>{
     if(!err){
       resolve("Resized image saved!")
     } else {
       reject({message:"Failed to resize the image!"})
     }
   })
  } catch (err) {
   reject({message:"Failed to read the image!"})
  }
 }) 
}

// Generate a unique name
export const generateUniqueId = () => {
  return v4();
}

// Get file's extensions
export const getFileExtension = (fileName) => {
  return fileName.split(".").reverse()[0]
}

