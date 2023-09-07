import mongoose from "mongoose";
import validattor from 'validator';
import bcrypt from 'bcryptjs'
import Jwt from "jsonwebtoken";
// const keySecret = "mynameisashishgshajmnbhgsysuisap";

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        validattor(value) {
            if (!validattor.isEmail(value)) {
                throw new Error("Not a vailid email")
            }
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    cpassword: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [
        {
            token: {
                type: String,
                require: true,
            }
        }
    ]
});

//hash password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }

    next();
});

userSchema.methods.generateAuthToken = async function () {
    try {
        const token23 = Jwt.sign({ _id: this._id }, process.env.ADMIN_KEY_SECRET, {
            expiresIn: '1d'
        });
        this.tokens = this.tokens.concat({ token: token23 });
        await this.save();
        return token23
    } catch (error) {
        console.log(error);
        res.status(400).send(error)
    }
}

const Admin = mongoose.model("Admin", userSchema);

export default Admin