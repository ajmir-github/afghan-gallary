import mongoose from "mongoose"


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