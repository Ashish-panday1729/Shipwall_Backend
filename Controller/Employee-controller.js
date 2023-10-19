import EmployeeDB from "../model/Employee-schema.js";
import moment from "moment";
import cloudinary from 'cloudinary';
import bcrypt from 'bcryptjs'
import userDB from "../model/User-Schema.js";
import CartDB from "../model/CartSchema.js";

// registration
export const registerEmployee = async (req, res) => {
    try {
        const file = req.file;

        const { fname, lname, email, mobile, gender, status, location, address, password, cpassword, accountNo, IFSC_code, bankName, branchName, branchCode } = req.body;

        if (!fname || !lname || !email || !mobile || !gender || !status || !location || !file || !password || !cpassword || !address || !accountNo || !IFSC_code || !bankName || !branchName || !branchCode) {

            return res.status(401).send({ message: "All inputs are required!" });
        }

        const preUser = await EmployeeDB.findOne({ email: email });
        if (preUser) {
            return res.status(400).send({ message: "User already exists!" });
        }

        const dateCreated = moment(new Date()).format("YYYY-MM-DD hh:mm:ss");
        const userId = req.userId;

        const uploadResult = await cloudinary.v2.uploader.upload(file.path);

        const userData = await EmployeeDB({
            fname, lname, email, mobile, gender, status, address, password, cpassword, accountNo, IFSC_code, bankName, branchName, branchCode,
            Billing_address: [{ location }],
            shipng_address: [{ address }],

            profile: uploadResult.secure_url, dateCreated, Created_By: userId
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
export const sellerLoginWithStatus = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(401).send({ success: false, message: "Please fill all the fields!" });
    }
    try {
        const userValid = await EmployeeDB.findOne({ email: email });
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
        const user = await EmployeeDB.findOne({ _id: req.userId });
        res.status(201).json({ success: true, user })
    } catch (error) {
        console.log(error);
        res.status(404).send({ message: "Not a valid user", error })
    }
};

// get users added by employee
export const getMyUsers = async (req, res) => {
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
        const myUsers = await userDB.find({ Created_By: req.userId })
            .sort({ dateCreated: sort == "new" ? -1 : 1 })
            .skip(skip)
            .limit(ITEM_PER_PAGE);
        const totalUsers = myUsers.length;

        if (totalUsers === 0) {
            res.status(200).send({ success: true, message: "You have no users currently!" });
        } else {
            const pageCount = Math.ceil(count / ITEM_PER_PAGE);
            res.status(200).send({
                success: true,
                pagination: {
                    count, pageCount
                },
                data: myUsers
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server error", error });
    }
};

// add a customer 
export const addCustomerBySellerEmployee = async (req, res) => {
    try {
        const file = req.file;

        const { fname, lname, email, mobile, gender, status, location, address, password, cpassword, accountNo, IFSC_code, bankName, branchName, branchCode } = req.body;

        if (!fname || !lname || !email || !mobile || !gender || !status || !location || !file || !password || !cpassword || !address || !accountNo || !IFSC_code || !bankName || !branchName || !branchCode) {

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
            fname, lname, email, mobile, gender, status, address, password, cpassword, accountNo, IFSC_code, bankName, branchName, branchCode,
            Billing_address: [{ location }],
            shipng_address: [{ address }],

            profile: uploadResult.secure_url, dateCreated, Created_By: userId
        });

        // hash password here
        await userData.save();
        return res.status(200).send({ message: "Successfully Registered!", userData });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "An error occurred" });
    }
};

// update shiping address
export const updateShipingAddress = async (req, res) => {
    try {
        const { address_2, address_1 } = req.body;

        const validUser = await userDB.findOne({ _id: req.userId });
        if (!validUser) {
            res.status(404).send({ message: "User not found" })
        } else {
            const updateShipingAddress = await userDB.findByIdAndUpdate({ _id: validUser._id },
                { shipng_address: [{ address_2, address_1 }] },
                { new: true }
            );
            res.status(200).send({ success: true, message: "Shiping Address Updated", data: updateShipingAddress })

        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
};







