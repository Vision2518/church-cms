import express from "express";
// Make sure this matches your file name exactly and ends with .js
import { getWelcomeMessage, testDbConnection } from "../controllers/testController.js";

const router = express.Router();

router.get("/welcome", getWelcomeMessage);
router.get("/db-test", testDbConnection);

export default router;