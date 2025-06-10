import UserModel from "../models/userModel.js";
import { userCreateSchema } from "../schemas/userSchema.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const createAdmin = async (user) => {
  const validatedUser = userCreateSchema.parse(user);
  const hashedPassword = await bcrypt.hash(user.password, 10);
  console.log("h@");

  await prisma.users.create({
    data: {
      username: validatedUser.username,
      email: validatedUser.email,
      password_hash: hashedPassword,
      role: "admin",
    },
  });
};

createAdmin({
  username: "god666",
  email: "jesus.christ@gmail.heaven",
  password: "777777",
});
