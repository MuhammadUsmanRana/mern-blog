import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandler(400, "All Field are required"))
    }

    const hashPassword = bcrypt.hashSync(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashPassword
    })
    try {
        await newUser.save()
        res.json({ success: true, message: "Sign Up Successful" });
    } catch (error) {
        next(error)
    }
}


export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, "All Field are required"))
    }
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, 'user not found'))
        }
        const validPassword = bcrypt.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid Password'))
        }
        const token = jwt.sign({
            id: validUser._id
        }, process.env.JWT_SECRET);

        const { password: pass, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        })
            .json({ success: true, ...rest })
    } catch (error) {
        next(error)
    }
}