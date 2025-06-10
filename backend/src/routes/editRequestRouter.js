import express from "express";
import {
  authenticateUserToken,
  authenticateAdminToken,
} from "../unitilies/tokenAuthenticationMiddleware.js";
import { addLocationEditRequest } from "../controllers/locationController.js/";
const router = express.Router();

router.post("/", authenticateUserToken, addLocationEditRequest);

export default router;
