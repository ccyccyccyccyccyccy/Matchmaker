import { app, mongoose } from "./config";
import { generateToken, verifyToken } from "./auth";
import UserNoPassword from '../../shared/types/User'; // Import User type from shared types
import User from "./types/User"; 
import Project from "../../shared/types/Project";

const UserModel = require("./model/User")
const ProjectModel = require("./model/Project");
import { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();

const uri: string =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/your-app';

(async () => {
    try {
        await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "matchmaker", // Explicitly set database name
});
        console.log('Connected to the database');
    } catch(error) {
        console.error(error);
    }
})();


interface LoginRequestBody {
    email: string;
    password: string;
}

interface RegisterRequestBody {
    name: string;
    email: string;
    password: string;}

// interface ProjectDetailRequestBody {
//     projectID: string
// }



app.post(
    "/login",
    (req: Request<{}, any, LoginRequestBody>, res: Response) => {
        const { email, password } = req.body;
        UserModel.findOne({ email: email })
            .then((user: User | null) => {
                if (user) {
                    if (user.password === password) {
                        const token = generateToken(user._id); // Generate JWT
                        const userNoPassword: UserNoPassword = {
                            _id: user._id,
                            name: user.name,
                            email: user.email,
                            phone: user.phone,
                            biography: user.biography,}
                        return res.json({
                        status: "Success",  
                        token: token,
                        user: userNoPassword, // Return user without password
                    });
                    } else {
                        res.json("The password is incorrect");
                    }
                } else {
                    res.json("No record existed");
                }
            });
    }
)

app.post("/register", (req: Request<{}, any, RegisterRequestBody>, res:Response) => {
    console.log("Received request body:", req.body);
    UserModel.create(req.body as RegisterRequestBody)
    .then((user: User) => res.json(user))
    .catch((err: unknown) => res.json(err))
})

app.get("/allProjects", async(req: Request, res: Response) => { //returns all projects
    try{
        const projects: Project[]= await ProjectModel.find({}).lean()
        return res.json(projects);
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})

app.get("/projectDetail", async(req: Request, res: Response)=>{
    const {projectID} = req.query;
    if (!projectID) {
    return res.status(400).json({ error: "project ID is required" });
  }
    const query = { _id: projectID };
    try{
        const project:Project= await ProjectModel.findOne(query).lean()
        if (project){
            const userQuery= { _id: project.initiatorID };
            const initiator: User = await UserModel.findOne(userQuery).lean()
            if (initiator){
                return res.status(200).json({
                    project: project,
                    initiator: initiator
                })
            }
            return res.status(404).json({ error: "project is found but not initiator. project id:"+ project._id });
        }
        return res.status(404).json({ error: "project is not found" });
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

})

app.get("/myProjects" , async (req: Request, res: Response)=>{
    const {userID} = req.query;
    if (!userID) {
    return res.status(400).json({ error: "user ID is required" });
  }
  const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = verifyToken(token); // Verify token
    console.log("User verified")
    //res.json({ message: "Access granted", user: decoded });
    const query= { initiatorID: userID };
    const projects: Project[]= await ProjectModel.find(query).lean()
    return res.status(200).json(projects)
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
}
)

app.post("/addProject", (req: Request, res: Response)=>{
    const {userID} = req.query;
    if (!userID) {
    return res.status(400).json({ error: "user ID is required" });
  }
  const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try{
    const decoded = verifyToken(token); // Verify token
    ProjectModel.create(req.body as Project)
     console.log(req.body.vacancies)
    return res.status(201).json({status:"Success"})
    }
    catch(error){
        return res.status(404).json({error})

    }

}
)

app.post("/updateProject", async(req: Request, res: Response)=>{
    const {userID} = req.query;
    if (!userID) {
    return res.status(400).json({ error: "user ID is required" });
  }
  const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try{
    const decoded = verifyToken(token); // Verify token
    const filter = { _id: req.body.projectID }; // Replace with your document's ID
    const update = {
      $set: req.body.updateData,
    };
    const result = await ProjectModel.updateOne(filter, update);
     if (result.matchedCount > 0) {
      console.log(`Successfully matched and updated ${result.modifiedCount} document(s).`);
      return res.status(200).json({status:"Success"})
    } else {
      return res.status(404).json({status:"No documents matched the filter."});
    }
    
    }
    catch(error){
        return res.status(404).json({error})
    }

}
)

app.post("/deleteProject", async(req: Request, res: Response)=>{
    const {userID} = req.query;
    if (!userID) {
    return res.status(400).json({ error: "user ID is required" });
  }
  const token = req.headers.authorization?.split(" ")[1];
   if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try{
    const decoded = verifyToken(token); // Verify token
    const filter = { _id: req.body.projectID }; // Replace with your document's ID
    
    const result = await ProjectModel.deleteOne(filter);
     if (result.deletedCount === 1) {
      console.log(`Successfully deleted document.`);
      return res.status(200).json({status:"Success"})
    } else {
      return res.status(404).json({status:"No documents matched the filter."});
    }
    
    }
    catch(error){
        return res.status(404).json({error})
    }

}
)

app.listen(3001, () => {
    console.log("server is running")
})