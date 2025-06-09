import exress from "express";
import { getUser } from "../controllers/userController.js";
import {
  authenticateUserToken,
  authenticateAdminToken,
} from "../unitilies/tokenAuthenticationMiddleware.js";
const router = exress.Router();

router.get("/", authenticateUserToken, getUser);

export default router;
