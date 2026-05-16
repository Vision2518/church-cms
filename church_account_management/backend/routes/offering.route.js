import express from "express";
import {
  addOffering,
  getOfferings,
} from "../controllers/offering.controller.js";

const router = express.Router();

// POST route for adding offerings
router.post("/", addOffering);

// GET route for offerings history/analytics
router.get("/", getOfferings);

export default router;
