
import{mongoose} from "../config";
 const UserSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String, 
    phone: { type: String, default: null }, 
    biography: { type: String, default: null }, 
    
 })

 const UserModel = mongoose.model("users", UserSchema) //already the collection
 
 module.exports = UserModel