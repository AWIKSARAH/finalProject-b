import {
  createSocial,
  getAllSocials,
  getSocialById,
  updateSocial,
  deleteSocial,
} from "../controller/socialController.js";

import express from "express";

const router = express.Router();
router.post("/", createSocial);
router.get("/", getAllSocials);
router.get("/:id", getSocialById);
router.put("/:id", updateSocial);
router.delete("/:id", deleteSocial);

export default router;
