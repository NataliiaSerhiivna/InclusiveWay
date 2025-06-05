import express from "express";
import { deleteLocationPhoto } from "../controllers/photosController.js";
const router = express.Router();

router.delete("/:id", deleteLocationPhoto);

export default router;
