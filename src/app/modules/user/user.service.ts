import { Request } from "express";
import { prisma } from "../../config/prisma";
import "dotenv/config";
import bcrypt from "bcrypt";

const getMe = async (req: Request & { user?: any }) => {
  const userId = req.user?.userId;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: false },
  });
  return user;
};

const register = async (req: Request) => {
  const saltRounds = process.env.SALT_ROUNDS;
  const hasedPassword = await bcrypt.hash(
    req.body.password,
    Number(saltRounds)
  );
  const user = await prisma.user.create({
    data: { ...req.body, password: hasedPassword },
  });
  return user;
};

const getAllUsers = async (req: Request) => {
  const users = await prisma.user.findMany();

  return users;
};

const suspendUser = async (req: Request) => {
  const userId = req.params.id;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { isBanned: true },
  });

  return user;
};

export const userService = {
  register,
  getAllUsers,
  suspendUser,
  getMe,
};
