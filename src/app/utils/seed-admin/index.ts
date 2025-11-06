import "dotenv/config";
import { prisma } from "../../config/prisma";
import bcrypt from "bcrypt";

export const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL as string;
    const password = process.env.ADMIN_PASSWORD;
    const salt = process.env.SALT_ROUNDS;

    const admin = await prisma.user.findFirst({ where: { email } });
    if (admin) {
      return console.log("Admin user already exists");
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(salt));

    await prisma.user.create({
      data: { email, password: hashedPassword, role: "ADMIN", name: "admin" },
    });
    console.log("Admin user seeded successfully");
  } catch (error) {
    console.log(error);
  }
};
