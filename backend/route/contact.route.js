import express from "express";
import { createContact,getAllContacts,getUserContacts } from "../controller/contact.controller.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/add-contact",verifyToken, createContact);




export default router;
