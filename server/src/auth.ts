import dotenv from "dotenv";
import bcrypt from 'bcryptjs';
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

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // 🎯 Cost factor
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

