import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUserPrev,
  updatePassword,
  getUser,
  updateUser,
  updateUsers,
  login,
} from "../controller/userController.js";
import auth from "../middleware/jwtAuthenticationMiddleware.js";
const router = express.Router();

router.post("/login", login);
router.get("/", auth, getUsers);
router.get("/user/:id", getUser);
router.post("/",  createUser);
router.delete("/:id",  deleteUser);
router.patch("/profile",  updatePassword);
router.patch("/",  updateUser);
router.patch("/:id",  updateUsers);
router.patch("/conf/:id",  updateUserPrev);

export default router;
