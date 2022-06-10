// imports
import express from "express"
import { config } from "dotenv"
import database from "./utils.js"
import fileuploader from "express-fileupload"

// import routers
import controllers from "./controllers.js"

// Env varaibles
config("./.env")
const app =  express()
const PORT = process.env.PORT || 3000

// View Handlerbar
app.set("view engine", "ejs")

// Express Settings
app.use(express.static("public"))
app.use(express.json())
app.use(fileuploader())


// connect to database
database(process.env.DATABASE_URL)

// Routes
app.use("/", controllers)

// Server Listener
app.listen(PORT, ()=>{
  console.log(`--- Server is listening on port ${PORT}`)
})