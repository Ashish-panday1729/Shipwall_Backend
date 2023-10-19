import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
    brandname: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    brandimage: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const BrandDB = new mongoose.model("Brand", brandSchema);
export default BrandDB;