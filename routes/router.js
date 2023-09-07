import express from 'express'
import { getUser, logoutUser, userLogin, userRegistration, validateUsers } from '../Controller/admin-controller.js';
import { authenticate } from '../middleware.js/Authentication.js';
import { singleUserDetails, updateUserDetails, userDelete, userRegister, userget, updateStatus, userExport, userLoginWithStatus, Valid_User, logout_User, getAddedCustomersByEmployee, userRegisterByAdmin } from '../Controller/userController.js';
import upload from '../multerConfig/storageConfig.js';
import { getAllCompanyData, regCompany } from '../Controller/Company-ctrl.js';
import { cusAuth } from '../middleware.js/cusAuth.js';
const router = express.Router();

// Admin DB
router.post("/register-user", userRegistration);
router.post("/user-login", userLogin);
router.get("/validUser", authenticate, validateUsers);
router.get("/getUserDetails", getUser);
router.get("/logout", authenticate, logoutUser);

// User's DB
router.post("/users/register", cusAuth,  upload.single("user_profile"), userRegister);
router.post("/admins/users/register", authenticate, upload.single("user_profile"), userRegisterByAdmin);


router.post("/user/login", userLoginWithStatus);
router.get("/user/valid", cusAuth, Valid_User);
router.get("/api/user/logout", logout_User)

router.get("/users/details", userget);
router.get("/user/:id", singleUserDetails);
router.post("/user/edit/:id", upload.single("user_profile"), updateUserDetails);
router.delete("/user/delete/:id", userDelete);
router.put("/user/status/:id", updateStatus);
router.get("/userexports", userExport);

// get Added Customers By Employee by _id
router.get("/get-your-customers", cusAuth, getAddedCustomersByEmployee);


// Company-section
router.post("/api/v1/reg-company", regCompany);
router.get("/api/v1/get/company-data", getAllCompanyData);

// Customer section


export default router
