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

app.get("/allProjects", async(req: Request, res: Response) => {
    try{
        const projects: Project[]= await ProjectModel.find({}).lean()
        return res.json(projects);
    }
    catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
})


app.listen(3001, () => {
    console.log("server is running")
})