import express from "express";
import {
  createLocation,
  getLocation,
} from "../controllers/locationController.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("ok");
});

router.post("/", createLocation);

router.get("/:id", getLocation);

router.patch("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

router.post("/:id/review", (req, res) => {
  const id = req.params.id;
  res.status(200).send(`review added to ${id}`);
});
export default router;
