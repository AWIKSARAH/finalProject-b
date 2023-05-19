import express from "express";
import {
  getAllAnnouncements,
  createAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
  getAllReport,
  updateConfirmationById,
} from "../controller/announcementController.js";

import { searchAll } from "../controller/search.js";
const router = express.Router();

router.get("/", getAllAnnouncements);
router.get('/search', searchAll);
router.get("/report/", getAllReport);
router.post("/", createAnnouncement);
router.get("/:id", getAnnouncementById);
router.patch("/:id", updateAnnouncement);
router.patch("/report/:id", updateConfirmationById);
router.delete("/:id", deleteAnnouncement);
export default router;
