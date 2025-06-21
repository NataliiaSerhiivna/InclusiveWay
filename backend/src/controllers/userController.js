import {
  userCreateSchema,
  userEditSchema,
  userLoginSchema,
  userReturnSchema,
} from "../schemas/userSchema.js";
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
      username: user.username,
      email: user.email,
      password_hash: hashedPassword,
    });
    console.log("User created");

    res.status(201).send();
    return;
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
    const userData = userCreateSchema.parse(req.body);

    let user = await userModel.read(userData.email);
    if (!user) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      user = await userModel.create({
        username: userData.username,
        email: userData.email,
        password_hash: hashedPassword,
      });

      console.log("User created");
    }

    if (bcrypt.compare(userData.password, user.password_hash)) {
      const oldToken = req.cookies?.token;

      if (!oldToken) {
        const newToken = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          JWT_SECRET,
          {
            expiresIn: "3m",
          }
        );
        res.cookie("token", newToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 60 * 3 * 1000,
        });
      }

      delete user.password_hash;

      res.status(200).send(user);
      return;
    } else {
      res.status(402).send({ mesage: "Invalid credentials" });
      return;
    }
  } catch (error) {
    if (error instanceof zod.ZodError) {
      res.status(400).send(error.issues);
    } else {
      res.status(500).send(error.message);
    }
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userModel.read(req.userEmail);

    const validatedUser = userReturnSchema.parse(user);

    res.status(200).send(validatedUser);
    return;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      res.status(400).send(error.issues);
    } else {
      res.status(500).send(error.message);
    }
  }
};

export const editUser = async (req, res) => {
  try {
    const patches = userEditSchema.parse(req.body);
    const patchedUser = userReturnSchema.parse(
      await userModel.patch(req.userId, patches)
    );

    res.status(200).send(patchedUser);
    return;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      res.status(400).send(error.issues);
    } else {
      res.status(500).send(error.message);
    }
  }
};
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name || "";
    const filters = {
      name,
      page,
      limit,
    };
    const users = await userModel.getAll(filters);

    const response = {
      users: [],
    };

    users.forEach((user) => {
      response.users.push(userReturnSchema.parse(user));
    });

    res.status(200).send(response);

    return;
  } catch (error) {
    if (error instanceof zod.ZodError) {
      res.status(400).send(error.issues);
    } else {
      res.status(500).send(error.message);
    }
  }
};
