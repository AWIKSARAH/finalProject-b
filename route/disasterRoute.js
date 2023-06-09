import express from "express";
import {
  getAllDisasters,
  createDisaster,
  getDisasterById,
  updateDisaster,
  deleteDisaster,
  createDisasterRecords,
} from "../controller/disasterController.js"; // Import the controller functions

const router = express.Router();

// Routes for CRUD operations
router.get("/", getAllDisasters);
router.post("/", createDisaster);
router.post("/generate", createDisasterRecords);
router.get("/:id", getDisasterById);
router.put("/:id", updateDisaster);
router.delete("/:id", deleteDisaster);

export default router;
