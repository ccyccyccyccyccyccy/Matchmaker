import { app, mongoose } from "./config";

const UserModel = require("./model/User")
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

interface User {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    biography?: string;
}

app.post(
    "/login",
    (req: Request<{}, any, LoginRequestBody>, res: Response) => {
        const { email, password } = req.body;
        UserModel.findOne({ email: email })
            .then((user: User | null) => {
                if (user) {
                    if (user.password === password) {
                        res.json("Success");
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


app.listen(3001, () => {
    console.log("server is running")
})