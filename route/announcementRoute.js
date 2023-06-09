import express from "express";
import {
  getAllAnnouncements,
  createAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAllReport,
  updateConfirmationById,
  addReaction,
  getAll,
} from "../controller/announcementController.js";

import { searchAll } from "../controller/search.js";
const router = express.Router();
router.get("/", getAllAnnouncements);
router.get("/all", getAll);
router.get("/search", searchAll);
router.get("/report/", getAllReport);
router.post("/", createAnnouncement);
router.post("/:id", addReaction);
router.get("/:id", getAnnouncementById);
router.patch("/:id", updateAnnouncement);
router.patch("/report/:id", updateConfirmationById);
router.delete("/:id", deleteAnnouncement);
export default router;
