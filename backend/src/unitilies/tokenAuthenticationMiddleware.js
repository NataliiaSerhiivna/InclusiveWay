// Методи для автентифікації jwt токенів

import UserserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const userModel = new UserserModel();
export const authenticateUserToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).send({ message: "No access token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.read(decoded.email);

    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    res.status(500).send(error);
  }
};

export const authenticateAdminToken = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).send({ message: "No access token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.read(decoded.email);
    if (user.role === "admin") {
      req.userId = decoded.id;
      next();
    } else {
      res.status(403).send({ mesage: "Invalid token" });
      return;
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
