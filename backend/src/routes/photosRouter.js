import express from "express";
import { deleteLocationPhoto } from "../controllers/photosController.js";
const router = express.Router();

import {
  authenticateToken,
  authenticateAdminToken,
} from "../unitilies/tokenAuthenticationMiddleware.js";

router.delete("/:id", authenticateAdminToken, deleteLocationPhoto);

export default router;
