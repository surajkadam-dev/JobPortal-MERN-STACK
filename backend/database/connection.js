import mongoose from "mongoose";

export const connection = async () => {
  mongoose.connect(process.env.MONGO_URL, {
    dbName: "Project"
  }).then(() => {
    console.log("Databse connected successfully");
  }).catch(err => { console.log("some occured error",err) })




}
