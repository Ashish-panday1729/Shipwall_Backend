import mongoose from "mongoose";

const subCatagory = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    parentCatagory: {
        type: mongoose.ObjectId,
        ref: "All_Catagory",
        required: true,
    }
});

const SubCatagory = new mongoose.model("subcatagory", subCatagory);
export default SubCatagory;