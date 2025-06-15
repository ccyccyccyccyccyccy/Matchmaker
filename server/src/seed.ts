import mongoose from "mongoose";
const UserModel = require("./model/User")
const ProjectModel = require("./model/Project")
import User from "./types/User"; 
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

// Mock Data
const users = [
  { name: "Alice", email: "alice@gmail.com", password:  "alice@gmail.com" },
  { name: "Bob", email: "bob@gmail.com", password: "bob@gmail.com" },
    { name: "Charlie", email: "charlie@gmail.com", password: "charlie@gmail.com"}, 
    { name: "David", email: "david@gmail.com", password: "david@gmail.com"}
];

const seedUserDatabase = async () => {
  try {
    await UserModel.insertMany(users);
    console.log("Mock user data inserted!");
    const results: User[]= await UserModel.find({}).lean()
    const userIds = results.map(user => user._id);
    return userIds;
  } catch (error) {
    console.error("Error inserting mock user data:", error);
  }
};


const projects = [
  { 
    title: "AI Research", 
    projectDescription: "Exploring machine learning applications.", 
    initiatorID: "507f191e810c19729de860ea", // Replace with a valid ObjectId
    roleDecription: "Looking for data scientists.",
    vancancies: 3,
    postedDate: new Date(),
    tags: ["AI", "Machine Learning", "Research"],
    duration: "< 1 month"
  }, 
    {
        title: "Web Development",
        projectDescription: "Building a responsive web application.",
        initiatorID: "507f191e810c19729de860eb", // Replace with a valid ObjectId
        roleDecription: "Seeking front-end developers.",
        vancancies: 2,
        postedDate: new Date(),
        tags: ["Web Development", "JavaScript", "React"],
        duration: "1-3 months"
    },
    {
        title: "Mobile App",
        projectDescription: "Creating a cross-platform mobile app.",
        initiatorID: "507f191e810c19729de860ec", // Replace with a valid ObjectId
        roleDecription: "Looking for mobile developers.",
        vancancies: 4,
        postedDate: new Date(),
        tags: ["Mobile Development", "Flutter", "iOS", "Android"],
        duration: "3-6 months"
    }, 
    {
        title: "Blockchain Project",
        projectDescription: "Developing a decentralized application.",
        initiatorID: "507f191e810c19729de860ed", // Replace with a valid ObjectId
        roleDecription: "Seeking blockchain developers.",   
        vancancies: 5,
        postedDate: new Date(),
        tags: ["Blockchain", "Smart Contracts", "Ethereum"],
        duration: "6-12 months"
    }, 
    {
        title: "Data Analysis",
        projectDescription: "Analyzing large datasets for insights.",
        initiatorID: "507f191e810c19729de860ee", // Replace with a valid ObjectId
        roleDecription: "Looking for data analysts.",   
        vancancies: 2,
        postedDate: new Date(),
        tags: ["Data Analysis", "Statistics", "Python"],
        duration: "> 1 year"
    }
];

// Insert Data
const seedProjectDatabase = async (userIDs: String[]) => {
  try {
    const projectsWithUserIds = projects.map((project, index) => ({
      ...project,
      initiatorID: userIDs[index % userIDs.length] // Assigning user IDs in a round-robin fashion
    }));
    await ProjectModel.insertMany(projects);
    console.log("Mock data inserted!");
  } catch (error) {
    console.error("Error inserting mock data:", error);
  }
};

const seedDatabase = async () => {
  const userIds = await seedUserDatabase();
  if (userIds) {
    await seedProjectDatabase(userIds);
  }
  mongoose.connection.close();
};

seedDatabase();
