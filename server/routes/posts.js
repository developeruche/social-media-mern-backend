import express from "express";
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    likePost,
    getPostBySearch,
    commentPost
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();



router.get("/", getPosts);
router.get("/:id", getPost);
router.get("/search", getPostBySearch);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost); //we need the id to update a post
router.delete("/:id", auth, deletePost); //we need the id to update a post
router.patch("/:id/likePost", auth, likePost); //we need the id to update a post
router.patch("/:id/commentPost", auth, commentPost);





export default router;