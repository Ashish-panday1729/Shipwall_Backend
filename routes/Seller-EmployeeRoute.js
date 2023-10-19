import express from 'express';
import { Valid_User, addCustomerBySellerEmployee, getMyUsers, registerEmployee, sellerLoginWithStatus, updateShipingAddress } from '../Controller/Employee-controller.js';
import { authenticate } from "../middleware.js/Authentication.js"
import upload from '../multerConfig/storageConfig.js';
import { sellerAuth } from '../middleware.js/SellerAuth.js';
import { cusAuth } from '../middleware.js/cusAuth.js';

const employee = express.Router();

employee.post("/api/v1/add-seller-employee", authenticate, upload.single("user_profile"), registerEmployee);

employee.post("/api/v1/login-seller", sellerLoginWithStatus);

// logout
employee.get("/api/logout", sellerAuth, async (req, res) => {
    try {
        // Remove the token from the tokens array
        await req.rootUser.removeToken(req.token);
        res.status(200).send({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).send({ message: "Error logging out", error });
    }
});

employee.get("/api/v1/valid-seller", sellerAuth, Valid_User);

employee.get("/api/v1/get-my-users", sellerAuth, getMyUsers);

// add user by seller-employee
employee.post("/api/v1/add-my-users", sellerAuth, upload.single("user_profile"), addCustomerBySellerEmployee);

// edit shiping address of user
employee.post("/api/v1/employee/update-ship-address", cusAuth, updateShipingAddress);




export default employee;
