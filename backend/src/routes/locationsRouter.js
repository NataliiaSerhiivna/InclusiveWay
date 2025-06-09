import express from "express";
import {
  createLocation,
  getLocation,
  patchLocation,
  deleteLocation,
  addLocationPhoto,
  updateLocationFeatures,
  getLocations,
  addLocationComment,
  getLocationComments,
  getPendingLocations,
  analyzeRouteForAccessibility,
} from "../controllers/locationController.js";
import {
  authenticateUserToken,
  authenticateAdminToken,
} from "../unitilies/tokenAuthenticationMiddleware.js";

const router = express.Router();

router.get("/", getLocations);
router.get("/pending", authenticateAdminToken, getPendingLocations);

router.post("/", authenticateUserToken, createLocation);

router.get("/:id", getLocation);

router.patch("/:id", authenticateAdminToken, patchLocation);

router.delete("/:id", authenticateAdminToken, deleteLocation);

router.post("/:id/comments", authenticateUserToken, addLocationComment);
router.get("/:id/comments", getLocationComments);

router.put("/:id/features", authenticateAdminToken, updateLocationFeatures);

router.post("/:id/photos", authenticateAdminToken, addLocationPhoto);

router.post("/route/analyze", analyzeRouteForAccessibility);

export default router;
