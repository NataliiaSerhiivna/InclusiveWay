import express from "express";
import {
  createLocation,
  getLocation,
  patchLocation,
  deleteLocation,
  updateLocationPhotos,
  updateLocationFeatures,
  getLocations,
} from "../controllers/locationController.js";
const router = express.Router();

router.get("/", getLocations);

router.post("/", createLocation);

router.get("/:id", getLocation);

router.patch("/:id", patchLocation);

router.delete("/:id", deleteLocation);

router.post("/:id/comment", (req, res) => {
  const id = req.params.id;
  res.status(200).send(`review added to ${id}`);
});

router.post("/:id/update-photos", updateLocationPhotos);
router.post("/:id/update-features", updateLocationFeatures);

export default router;
