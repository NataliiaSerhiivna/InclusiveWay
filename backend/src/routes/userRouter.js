import express from "express";
import { getUsers } from "../controllers/userController.js";
import { authenticateAdminToken } from "../unitilies/tokenAuthenticationMiddleware.js";
const router = express.Router();

router.get("/", authenticateAdminToken, getUsers);

export default router;
