import express from "express";
import { deleteUser, getAllUsers, getUserById, updateUser } from "../controller/user.controller.js";
import { registerUser,loginUser,forgotPassword,verifyOtpLogin } from "../controller/auth.controller.js";

const router = express.Router();

router.post("/add-user", registerUser);
router.post("/login-user", loginUser);
router.post("/forget-password", forgotPassword);
router.post("/verify-otp", verifyOtpLogin);


router.get("/get-users", getAllUsers);
router.get("/get-user/:id", getUserById);
router.put("/update-user/:id", updateUser);
router.delete("/delete-user/:id", deleteUser);

export default router;
