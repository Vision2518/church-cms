import express from "express";
import { addOffering } from "../controllers/offering.controller.js";

const router = express.Router();

// POST route for adding offerings
router.post("/", addOffering);

export default router;