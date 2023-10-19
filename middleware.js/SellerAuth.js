import Jwt from "jsonwebtoken";
import mongoose from "mongoose";
import EmployeeDB from "../model/Employee-schema.js";

export const sellerAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        // Check if the token exists
        if (!token) {
            return res.status(401).json({ error: "JWT token missing!" });
        }

        // Verify the JWT token
        const verifytoken = await Jwt.verify(token, process.env.SELLER_KEY_SECRET);

        // Find the user based on the _id from the token
        const rootUser = await EmployeeDB.findOne({ _id: mongoose.Types.ObjectId(verifytoken._id) });
        if (!rootUser) {
            return res.status(401).json({ error: "User not found!" });
        }

        // Attach user data to the request object
        req.tokens = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    } catch (error) {
        console.log("cusAuth Error:", error.message);
        return res.status(401).json({ error: "Authentication failed!" });
    }
};