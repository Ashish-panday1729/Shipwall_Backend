import userDB from "../model/User-Schema.js";
import moment from 'moment'
import fs from 'fs'
import csv from 'fast-csv'
import bcrypt from 'bcryptjs'
import cloudinary from 'cloudinary';


// user registration 
export const userRegister = async (req, res) => {
    try {
        const file = req.file;
        const { fname, lname, email, mobile, gender, status, location, password, cpassword } = req.body;

        if (!fname || !lname || !email || !mobile || !gender || !status || !location || !file || !password || !cpassword) {
            return res.status(401).send({ message: "All inputs are required!" });
        }

        const preUser = await userDB.findOne({ email: email });
        if (preUser) {
            return res.status(400).send({ message: "User already exists!" });
        }

        const dateCreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const userId = req.userId;
        const userData = await userDB({
            fname, lname, email, mobile, gender, status, location, password, cpassword, profile: file, dateCreated, Created_By: userId
        });

        // hash password here
        await userData.save();
        return res.status(200).send({ message: "Successfully Registered!", userData });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occurred" });
    }
};

// user registration by admins only
export const userRegisterByAdmin = async (req, res) => {
    try {
        const file = req.file;

        const { fname, lname, email, mobile, gender, status, location, password, cpassword } = req.body;

        if (!fname || !lname || !email || !mobile || !gender || !status || !location || !file || !password || !cpassword) {
            return res.status(401).send({ message: "All inputs are required!" });
        }

        const preUser = await userDB.findOne({ email: email });
        if (preUser) {
            return res.status(400).send({ message: "User already exists!" });
        }

        const dateCreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const userId = req.userId;

        const uploadResult = await cloudinary.v2.uploader.upload(file.path);

        const userData = await userDB({
            fname, lname, email, mobile, gender, status, location, password, cpassword, profile: uploadResult.secure_url, dateCreated, Created_By: userId
        });

        // hash password here
        await userData.save();
        return res.status(200).send({ message: "Successfully Registered!", userData });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occurred" });
    }
};

// User login 
// export const userLoginWithStatus = async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(401).send({ success: false, message: "Please fill all the fields!" });
//     }
//     try {
//         const userValid = await userDB.findOne({ email: email });
//         if (userValid) {
//             const isMatch = await bcrypt.compare(password, userValid.password);
//             if (!isMatch) {
//                 res.status(400).json({ message: "Invalid Credentials!" });
//             } else {
//                 if (userValid.status === "Active") {
//                     // token generate 
//                     const token = await userValid.generateAuthToken();

//                     const result = {
//                         userValid,
//                         token
//                     };
//                     res.status(201).send({ message: "Login Successful!", result });

//                 } else {
//                     res.status(400).send({ message: "Your status is not approved by admin till now.Please wait!" })
//                 }
//             }



//         }
//     } catch (error) {
//         console.log("Error while login: ", error);
//     }
// };

// User login 
export const userLoginWithStatus = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).send({ success: false, message: "Please fill all the fields!" });
    }
    try {
        const userValid = await userDB.findOne({ email: email });
        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);
            if (!isMatch) {
                res.status(400).json({ message: "Invalid Credentials!" });
            } else {
                if (userValid.status === "Active") {
                    // Generate a JWT token with the user's ObjectId as payload
                    const token = await userValid.generateAuthToken();

                    const result = {
                        userValid,
                        token
                    };
                    res.status(201).send({ message: "Login Successful!", result });
                } else {
                    res.status(400).send({ message: "Your status is not approved by admin till now. Please wait!" })
                }
            }
        }
    } catch (error) {
        console.log("Error while login: ", error);
        res.status(500).send({ message: "An error occurred" });
    }
};


//  Valid user
export const Valid_User = async (req, res) => {
    try {
        const user = await userDB.findOne({ _id: req.userId });
        res.status(201).json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.status(404).send({ message: "Not a valid user", error })
    }
};
// Logout User 
export const logout_User = async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((currelm) => {
            return currelm.token !== req.token
        });

        req.rootUser.save();
        res.status(201).send({ message: "Successfully logout" });
        // res.status(201).send(req.rootUser.tokens);

    } catch (error) {
        console.log(error);
        res.status(201).json(error);

    }
}

// user get 
export const userget = async (req, res) => {
    const search = req.query.search || "";
    const gender = req.query.gender || "";
    const status = req.query.status || "";
    const sort = req.query.sort || "";
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = 4;

    const query = {
        fname: { $regex: search, $options: "i" }
    }
    // console.log(req.query)
    if (gender !== "All") {
        query.gender = gender
    }

    if (status !== "All") {
        query.status = status
    }

    try {
        const skip = (page - 1) * ITEM_PER_PAGE;
        const count = await userDB.countDocuments(query);

        const userdata = await userDB.find(query)
            .sort({ dateCreated: sort == "new" ? -1 : 1 })
            .skip(skip)
            .limit(ITEM_PER_PAGE);

        const pageCount = Math.ceil(count / ITEM_PER_PAGE);
        res.status(201).send({
            pagination: {
                count, pageCount
            },
            userdata
        });
    } catch (error) {
        console.log(error);
        res.status(401).send(error);
    }
};

// user get for Employee

export const getAddedCustomersByEmployee = async (req, res) => {
    try {
        const userId = req.userId; // req.userId is already an ObjectId

        const customers = await userDB.find({ Created_By: userId });
        res.status(200).send(customers);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};


// Single user
export const singleUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const singleuser = await userDB.findById({ _id: id });
        res.status(201).json(singleuser);
    } catch (error) {
        console.log(error);
        res.status(401).send(error);
    }
};
// Update a user 
export const updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const { fname, lname, email, mobile, gender, status, location, user_profile } = req.body;
    const file = req.file ? req.file.filename : user_profile;
    const dateUpdated = moment(new Date()).format("YYYY-MM-DD HH:mm:ss"); // Corrected date format

    try {
        const updatedUser = await userDB.findByIdAndUpdate({ _id: id }, {
            fname, lname, email, mobile, gender, status, location, profile: file, dateUpdated
        },
            { new: true }
        );
        await updatedUser.save();
        res.status(201).send(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(501).send(error);
        res.status(400).send(error);
    }
};

// Delete user
export const userDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userDB.findByIdAndDelete({ _id: id });
        res.status(201).json({ message: "Successfully deleted!" });

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

// User update status 
export const updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const userStatusUpdate = await userDB.findByIdAndUpdate(
            { _id: id },
            { status: status },
            { new: true }
        );

        await userStatusUpdate.save();
        res.status(200).json({
            message: "Updated successfully!",
            userStatusUpdate
        });
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};
// csv
export const userExport = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
    }
}