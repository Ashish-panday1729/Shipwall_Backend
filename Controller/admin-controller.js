import Admin from '../model/AdminSchema.js';
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser';

export const userRegistration = async (req, res) => {
    try {
        const { fname, email, password, cpassword } = req.body;

        if (!fname || !email || !password || !cpassword) {
            res.status(400).json({ message: "Please fill all the fields!" })
        } else {
            const preUser = await Admin.findOne({ email: email });
            if (preUser) {
                res.status(400).json({ message: "User Already Exists!" });
            } else if (password !== cpassword) {
                res.status(400).json({ message: "Password and cpassword is not matched!" });
            } else {
                const finalUser = new Admin({
                    fname, email, password, cpassword
                });

                //hash password here
                const storeData = await finalUser.save();
                res.status(200).send({ status: 201, message: "User added successfully!", storeData })
            }
        }

    } catch (error) {
        console.log(error)
    }
};
 // Admin login 
export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Please fill all the fields!" })
    }

    try {

        const userValid = await Admin.findOne({ email: email });
        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);

            if (!isMatch) {
                res.status(400).json({ message: "Invalid Credentials!" })
            } else {
                //token generate here
                const token = await userValid.generateAuthToken();

                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true
                });

                const result = {
                    userValid,
                    token
                }

                res.status(201).send({ message: "Login Successful!", result });

            }


        }


    } catch (error) {
        console.log(error);
    }
};

//Validate users
export const validateUsers = async (req, res) => {
    try {
        const validUserOne = await Admin.findOne({ _id: req.userId });
        res.status(201).json({ status: 201, validUserOne });
    } catch (error) {
        console.log(error);
        res.status(401).json({ status: 401, error });

    }
};

export const getUser = async (req, res) => {
    try {
        const user = await Admin.find({});
        res.status(201).json({ message: "User get successfully!", user });
    } catch (error) {
        console.log(error);
    }
};

// Logout User 
export const logoutUser = async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((currelm) => {
            return currelm.token !== req.token
        });

        res.clearCookie("usercookie", { path: "/" });
        req.rootUser.save();
        res.status(201).send({ message: "Successfully logout" });
        // res.status(201).send(req.rootUser.tokens);

    } catch (error) {
        console.log(error);
        res.status(201).json(error);

    }
}

