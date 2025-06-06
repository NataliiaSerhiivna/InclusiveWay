import { userCreateSchema, userLoginSchema } from "../schemas/userSchema.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import zod from "zod";
const userModel = new UserModel();

const JWT_SECRET = process.env.JWT_SECRET;

export const createUser = async (req, res) => {
  try {
    const user = userCreateSchema.parse(req.body);

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await userModel.create({
      name: user.username,
      email: user.email,
      password_hash: hashedPassword,
    });
    console.log("User created");

    res.status(204).send();
  } catch (error) {
    if (error instanceof zod.ZodError) {
      res.status(400).send(error.issues);
    } else {
      res.status(500).send(error.message);
    }
  }
};
export const authenticateUser = async (req, res) => {
  try {
    const userData = userLoginSchema.parse(req.body);

    const user = await userModel.read(userData.email);

    if (bcrypt.compare(userData.password, user.password_hash)) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
        },
        JWT_SECRET,
        {
          expiresIn: "3m",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 3 * 1000,
      });
      delete user.id;
      delete user.password_hash;
      delete user.role;
      res.status(200).send(user);
    }
  } catch (error) {
    if (error instanceof zod.ZodError) {
      res.status(400).send(error.issues);
    } else {
      res.status(500).send(error.message);
    }
  }
};
export const getUser = async (req, res) => {};
