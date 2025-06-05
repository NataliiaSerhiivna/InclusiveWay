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
} from "../controllers/locationController.js";
const router = express.Router();

router.get("/", getLocations);

router.post("/", createLocation);

router.get("/:id", getLocation);

router.patch("/:id", patchLocation);

router.delete("/:id", deleteLocation);

router.post("/:id/comments", addLocationComment);
router.get("/:id/comments", getLocationComments);

router.put("/:id/features", updateLocationFeatures);

router.post("/:id/photos", addLocationPhoto);

export default router;
