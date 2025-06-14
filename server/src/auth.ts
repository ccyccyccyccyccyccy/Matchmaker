import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECRET_KEY;
if (!secretKey) {
  throw new Error("SECRET_KEY is not defined in the environment variables");
}

import jwt from "jsonwebtoken";


export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, secretKey, { expiresIn: "1h" }); // Expires in 1 hour
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null; // Invalid token
  }
};
