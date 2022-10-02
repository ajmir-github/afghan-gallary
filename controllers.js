// imports
import express from "express"
import { postModel } from "./model.js"
import {
 generateUniqueId,
 getFileExtension,
 resizeImage,
 deleteFiles
} from "./utils.js"


const router = express.Router()


// Global vars
let departments = [];

// Update global vars
const updateDepartments = async()=>{
  
  const posts = await postModel.find({}, "keywords -_id")
  // flat array => [].concat(...array)
  const words = [].concat(...posts.map(({keywords})=>
    keywords.split(",").map(a=>a.trim())
  ))
  const uniqueKeywords = new Set(words)
  let keywords = []
  uniqueKeywords.forEach(word=>{
    let times = 0
    const pattern = new RegExp(word, "ig")
    words.forEach(w =>{
      if (pattern.test(w)) times++
    })
    keywords.push([word, times]);
  })
  
  departments = keywords.sort((a, b)=>b[1]-a[1])
  departments.length = 16
}
// initiate global vars
updateDepartments()


// HOME => /
router.get("/", async (req, res)=>{
  const skip = +req.query?.skip || 0
  const limit = +req.query?.limit || 8
  const department = req.query?.department || ""
  const search = req.query?.search || ""
  let query = {}
  if(department !== ""){
    query = {
      keywords: new RegExp(department, "ig")
    }
  }
  if(search !== ""){
    query = {
      "$or":[
        {title: new RegExp(search, "ig")},
        {keywords: new RegExp(search, "ig")}
      ]
    }
  }
  try {
    const posts = await postModel
      .find(query)
      .limit(limit)
      .skip(skip)
      .sort({date:-1})
    res.render("index", {
      title:"Afghan Gallery",
      posts,
      navActive: department !== "" ? 2:1,
      loadmore:(posts.length >= limit),
      limit, 
      skip,
      departments
    })
  } catch (error) {
    res.send("failed page")
  }
})

// UPLOAD => /upload
router.get("/upload", (req, res)=>{
 res.render("upload", {
  title:"Upload",
  navActive:3,
  departments
 })
})

// SINGLE-IMAGE => /single
router.get("/single/:id", async (req, res)=>{
  const posts = await postModel
    .find()
    .limit(4)
    .skip(0)
    .sort({liked:-1})

  const post = await postModel
    .findById(req.params.id)
    
 res.render("single_image", {
  title:"Image: ",
  navActive:2,
  loadmore:false,
  post,
  posts,
  departments
 })
})

// ABOUT => /about
router.get("/about", (req, res)=>{
 res.render("about", {
  title:"About",
  navActive:5,
  departments
 })
})


// Increment likes /link/postID
router.get("/like/:id", async (req, res)=>{
  try {
    const foundPost = await postModel.findById(req.params.id)
    foundPost.liked = foundPost.liked + 1
    await foundPost.save()
    res.send("Liked!")
  } catch (error) {
    res.status(500).send("failed")
  }
})

// Decrement likes /dislike/postID
router.get("/dislike/:id", async (req, res)=>{
  try {
    const foundPost = await postModel.findById(req.params.id)
    if(foundPost.liked > 0){
      foundPost.liked = foundPost.liked - 1
      await foundPost.save()
    }
    res.send("Disiked!")
  } catch (error) {
    res.status(500).send("failed")
  }
})


// POST UPLOAD IMAGE
router.post("/upload", async (req, res)=>{
  // Upload image to profilePhoto of the user
  const imageFile = req.files.image
  const fileName =  generateUniqueId()
  const fileExt = getFileExtension(imageFile.name)
  const lgImageName = `./public/files/${fileName}.${fileExt}`
  const smImageName = `./public/files/${fileName}.min.${fileExt}`
  // Get the image from upload and save it
  try {
    await imageFile.mv(lgImageName)
    await resizeImage(lgImageName, smImageName, {h:600, w:500})
   
    const image = {
      lg:`${fileName}.${fileExt}`,
      sm:`${fileName}.min.${fileExt}`
    }
  
    const imageModel = new postModel({...req.body, image})
    await imageModel.save()
    res.json("Image uploaded!")
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
    // garbage collector
    deleteFiles([lgImageName, smImageName])
  }
  updateDepartments()
})


export default router