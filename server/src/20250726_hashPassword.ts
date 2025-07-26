import mongoose from "mongoose";
const UserModel = require("./model/User")
import User from "./types/User"; 
import {hashPassword} from "./auth";
import dotenv from 'dotenv';
dotenv.config();

const uri: string|undefined =
    process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is not defined in the environment variables");}

(async () => {
    try {
        await mongoose.connect(uri, {
    dbName: "matchmaker", // Explicitly set database name
});
        console.log('Connected to the database');
    } catch(error) {
        console.error(error);
    }
})();

(async ()=>{
  const users = await UserModel.find();
for (let user of users) {
  user.password = await hashPassword(user.password); // your async logic
  await user.save();
}
})()

console.log("Passwords hashed")
