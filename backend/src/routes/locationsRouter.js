import express from "express";
import {
  createLocation,
  getLocation,
  patchLocation,
  deleteLocation,
  updateLocationPhotos,
  updateLocationFeatures,
} from "../controllers/locationController.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("ok");
});

router.post("/", createLocation);

router.get("/:id", getLocation);

router.patch("/:id", patchLocation);

router.delete("/:id", deleteLocation);

router.post("/:id/review", (req, res) => {
  const id = req.params.id;
  res.status(200).send(`review added to ${id}`);
});

router.post("/:id/update-photos", updateLocationPhotos);
router.post("/:id/update-features", updateLocationFeatures);

export default router;
