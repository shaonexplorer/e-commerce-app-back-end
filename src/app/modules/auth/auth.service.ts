import { Request } from "express";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const login = async (req: Request) => {
  const { email, password } = req.body;
  const jwt_secret = process.env.JWT_SECRET;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const accessToken = jwt.sign(
    { userId: user.id, userRole: user.role },
    jwt_secret as string,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id, userRole: user.role },
    jwt_secret as string,
    { expiresIn: "30d" }
  );

  return { accessToken, refreshToken };
};

export const AuthService = {
  login,
};
