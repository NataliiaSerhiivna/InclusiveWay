import express from "express";
import {
  authenticateAdminToken,
  authenticateUserToken,
} from "../unitilies/tokenAuthenticationMiddleware.js";
import {
  addLocationEditRequest,
  getLocationEditRequest,
} from "../controllers/locationEditRequestController.js";
const router = express.Router();

router.post("/", authenticateUserToken, addLocationEditRequest);
router.get("/:id", authenticateAdminToken, getLocationEditRequest);
router.get("/", authenticateAdminToken);
export default router;
