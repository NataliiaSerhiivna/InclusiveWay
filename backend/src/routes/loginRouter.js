import express from "express";
import { createUser, authenticateUser } from "../controllers/userController.js";
const router = express.Router();

router.post("/", authenticateUser);

export default router;
