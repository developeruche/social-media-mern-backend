import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const LIMIT = 10;
        const START_INDEX = (Number(page) -1) * LIMIT; // getting the starting index of every page
        const total = await PostMessage.countDocuments({});


        // retriving all the post currently in the database
        const posts = await PostMessage.find().sort({_id: -1}).limit(LIMIT).skip(START_INDEX);


        return res.status(200).json({
            data: posts,
            currentPage: Number(page),
            numberOfPages: Math.ceil(total / LIMIT)
        });
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        const post = await PostMessage.findById(id);
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message})
    }
}


export const getPostBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query;

    try {
        const title = new RegExp(searchQuery, "i");
        const posts = await PostMessage.find(({ $or: [{ title }, {tags: { $in: tags.split(",")}}] }));

        res.json({data: posts});
    } catch (error) {
        res.status(404).json({message: error.message})
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString()})
    try {
        await newPost.save();

        return res.status(201).json(newPost);
    } catch (error) {
        return res.status(409).json(error.message);
    }
}

export const updatePost = async (req, res) => {
    const {id: _id} = req.params;
    const post = req.body;

    // validating
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("no post with that id");

    const updatePost = await PostMessage.findByIdAndUpdate(_id, {...post, _id}, {new: true}); //new is set true so we can recieve the updated version of the post

    res.json(updatePost);
}

export const deletePost = async (req, res) => {
    const {id: _id} = req.params;

    // validating
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("no post with that id");

    // deleting
    await PostMessage.findByIdAndRemove(_id);

    res.json({message: "Post deleted successfully"});
}


export const likePost = async (req, res) => {
    const {id} = req.params;

    if (!req.userId) return res.json({message: "Unauthentication"});

    // validating
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("no post with that id");

    // First iw would be fetching the post
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));

    if(index === -1) {
        post.likes.push(req.userId);
    }else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});


    res.json(updatedPost);
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { value } = req.body;
    
    const post = await PostMessage.findById(id);
    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {new: true});

    res.json(updatePost)

}