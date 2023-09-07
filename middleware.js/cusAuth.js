// import Jwt from "jsonwebtoken";
// import userDB from "../model/User-Schema.js";
// import mongoose from "mongoose"; // Import mongoose to work with ObjectId

// export const cusAuth = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization;
//         console.log(token)

//         const verifytoken = await Jwt.verify(token, process.env.CUSTOMER_KEY_SECRET);
//         console.log(verifytoken)


//         const rootUser = await userDB.findOne({ _id: mongoose.Types.ObjectId(verifytoken._id) });
//         if (!rootUser) {
//             return res.status(401).json({ error: "JWT token missing!" });
//         }


//         req.tokens = token;
//         req.rootUser = rootUser;
//         req.userId = rootUser._id;

//         next();
//     } catch (error) {
//         console.log("cusAuth Error : ",error);
//         return res.status(401).json({ error: "Authentication failed!", error });
//     }
// };


import Jwt from "jsonwebtoken";
import userDB from "../model/User-Schema.js";
import mongoose from "mongoose";

export const cusAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        // Check if the token exists
        if (!token) {
            return res.status(401).json({ error: "JWT token missing!" });
        }

        // Verify the JWT token
        const verifytoken = await Jwt.verify(token, process.env.CUSTOMER_KEY_SECRET);

        // Find the user based on the _id from the token
        const rootUser = await userDB.findOne({ _id: mongoose.Types.ObjectId(verifytoken._id) });
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
