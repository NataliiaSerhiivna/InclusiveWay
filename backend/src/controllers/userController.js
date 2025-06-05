import { userCreateSchema } from "../schemas/userSchema.js";
import UserModel from "../models/userModel.js";

const userModel = new UserModel();

export const createUser = async (req, res) => {
  try {
    const user = userCreateSchema.parse(req.body);
    const newUser = await userModel.create({
      name: user.username,
      email: user.email,
      password_hash: user.password,
    });

    res.status(204).send(newUser);
  } catch (error) {
    if (error instanceof zod.ZodError) {
      res.status(400).send(error.issues);
    } else {
      res.status(500).send(error.message);
    }
  }
};
