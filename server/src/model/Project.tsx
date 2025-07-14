
import { title } from "process";
import{mongoose} from "../config";
 const ProjectSchema = new mongoose.Schema({
    title:String,
    projectDescription:String,
    roleDescription:String, 
    initiatorID:  { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    vacancies: Number,
    postedDate: { type: Date, default: Date.now },
    tags: { type: [String], default: [] }, 
    duration: { type: String, enum: ["< 1 month", "1-3 months", "3-6 months", "6-12 months", "> 1 year"] }, 
    
 })

 const ProjectModel = mongoose.model("projects", ProjectSchema) //already the collection
 
 module.exports = ProjectModel