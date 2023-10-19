import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
    productID: {
        required: true,
        ref: "Products",
        type: mongoose.ObjectId,
    },
    productName: {
        type: String,
    },
    photo: {
        type: String
    },
    category: {
        type: mongoose.ObjectId,
        ref: "All_Catagory",
    },
    addedBy: {
        type: mongoose.ObjectId,
        ref: "user"
    },
    dateCreated: Date,
});

const WishListDB = new mongoose.model("Wish_List", wishListSchema);
export default WishListDB;