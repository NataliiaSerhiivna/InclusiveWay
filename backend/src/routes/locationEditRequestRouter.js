import express from "express";
import {
  authenticateAdminToken,
  authenticateUserToken,
} from "../unitilies/tokenAuthenticationMiddleware.js";
import {
  addLocationEditRequest,
  deleteLocationEditRequest,
  fulfillTheRequest,
  getAllLocationEditRequests,
  getLocationEditRequest,
} from "../controllers/locationEditRequestController.js";
const router = express.Router();

router.post("/", authenticateUserToken, addLocationEditRequest);
router.get("/:id", authenticateAdminToken, getLocationEditRequest);
router.get("/", authenticateAdminToken, getAllLocationEditRequests);
router.post("/:id", authenticateAdminToken, fulfillTheRequest);
router.delete("/:id", authenticateAdminToken, deleteLocationEditRequest);
export default router;
