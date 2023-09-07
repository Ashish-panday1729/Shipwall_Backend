import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import Jwt from "jsonwebtoken";
const key_Secret = "thissecretforuserlogin@#done!";

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
    },
    lname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        validator(value) {
            if (!validate.isEmail(value)) {
                throw new Error("Not a valid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    cpassword: {
        type: String,
        required: true,
        minlength: 6
    },
    mobile: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        unique: true,
    },
    gender: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    dateCreated: Date,
    dateUpdated: Date,
    Created_By: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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

// hash password here
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);

    }
});

// generate token
userSchema.methods.generateAuthToken = async function () {
    try {
        const gentoken = await Jwt.sign({ _id: this._id }, key_Secret, {
            expiresIn: "1d"
        });
        this.tokens = this.tokens.concat({ token: gentoken });
        await this.save();
        return gentoken;
    } catch (error) {
        console.log("token generate error: ", error);
        res.status(400).send(error)
    }
}

const userDB = new mongoose.model("user", userSchema);

export default userDB;