import User from "../models/user.model.js";
import bcrypt from "bcrypt";


export const signup = async (req, res) => {
    console.log(req.body, "body");
    const { username, email, password } = req.body;
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return res.status(400).json({ message: "All field are required" })
    }

    const hashPassword = bcrypt.hashSync(password, 10)
    const newUser = new User({
        username,
        email,
        password: hashPassword
    })
    try {
        await newUser.save()
        res.json({ message: "Sign Up Successfull" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}