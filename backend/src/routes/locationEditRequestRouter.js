import express from "express";
import { authenticateUserToken } from "../unitilies/tokenAuthenticationMiddleware.js";
import { addLocationEditRequest } from "../controllers/locationEditRequestController.js";
const router = express.Router();

router.post("/", authenticateUserToken, addLocationEditRequest);

export default router;
