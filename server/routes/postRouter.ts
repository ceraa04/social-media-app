import { Router } from "express";

const express = require("express");
const router: Router = express.Router()
import { protect } from "../middlewares/authMiddleware";
import { createPost, getAllPosts } from "../controllers/postController";
import { upload } from "../config/multerConfig";

router
    .route("/createPost")
    .post(protect, upload.single("postImg"), createPost)

router
    .route("/getAllPosts")
    .get(getAllPosts)
export default router