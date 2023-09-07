// import Jwt from "jsonwebtoken";
// import User from "../model/AdminSchema.js";
// const keySecret = "mynameisashishgshajmnbhgsysuisap";


// export const authenticate = async (req, res, next) => {

//     try {
//         const token = req.headers.authorization;
//         const verifytoken = Jwt.verify(token, process.env.ADMIN_KEY_SECRET)
//         const rootUser = await User.findOne({ _id: mongoose.Types.ObjectId(verifytoken._id) });
//         if (!rootUser) { throw new Error("user not found") };

//         req.token = token
//         req.rootUser = rootUser
//         req.userId = rootUser._id

//         next();

//     } catch (error) {
//         res.status(401).json({ status: (401), error: "Unauthorised no token provided!" });
//         console.log("Authenticate error : ", error)
//     }
// };


import Jwt from "jsonwebtoken";
import User from "../model/AdminSchema.js";
import mongoose from "mongoose"; // Import mongoose to work with ObjectId

export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        // Check if the token exists
        if (!token) {
            return res.status(401).json({ error: "JWT token missing!" });
        }

        // Verify the JWT token
        const verifytoken = await Jwt.verify(token, process.env.ADMIN_KEY_SECRET);

        // Find the user based on the _id from the token
        const rootUser = await User.findOne({ _id: mongoose.Types.ObjectId(verifytoken._id) });
        if (!rootUser) {
            return res.status(401).json({ error: "User not found!" });
        }

        // Attach user data to the request object
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    } catch (error) {
        console.log("Authenticate Error:", error.message);
        return res.status(401).json({ error: "Authentication failed!" });
    }
};
