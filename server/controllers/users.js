import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";



export const signin = async (req, res) => {
    const {email, password} = req.body;

    try {
        const exisitingUser = await User.findOne({email}); //getting the user associated with the email

        if(!exisitingUser) return res.status(404).json({message: "User doesn't exisit."}); //return is an exisiting user does not exist, an error is returned

        const isPasswordCorrect = await bcrypt.compare(password, exisitingUser.password); //comparing password hash

        if(!isPasswordCorrect) return res.status(400).json({"message": "Invalid Cridential"});

        const token = jwt.sign({email: exisitingUser.email, id: exisitingUser._id}, "secretkey", {expiresIn: "1h"});

        res.status(200).json({result: exisitingUser, token});

    } catch (error) {
        res.status(500).json({message: "Something went wrong..."});
    }
}

export const signup = async (req, res) => {
    const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName
    } = req.body;

    try {
        // Check if user is already signed up to the system
        const exisitingUser = await User.findOne({ email });
        if(exisitingUser) return res.status(400).json({message: "Account already exist."}); //return is an exisiting user does not exist, an error is returned

        // validating password
        if(password !== confirmPassword) return res.status(400).json({message: "Password does not match."});

        // hashing the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // creating the user
        const result = await User.create({
            email,
            password: hashedPassword,
            name: `${firstName} ${lastName}`
        })

        // creating the token
        const token = jwt.sign({email: result.email, id: result._id}, "secretkey", {expiresIn: "1h"});

        res.status(200).json({result, token});
    } catch (error) {
        res.status(500).json({message: "Something went wrong..."});
    }
}