import exress from "express";
import { editUser, getUser } from "../controllers/userController.js";
import {
  authenticateUserToken,
  authenticateAdminToken,
} from "../unitilies/tokenAuthenticationMiddleware.js";
const router = exress.Router();

router.get("/", authenticateUserToken, getUser);
router.patch("/", authenticateUserToken, editUser);
export default router;
