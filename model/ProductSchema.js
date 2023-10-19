import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        long_description: {
            type: String,
            // required: true
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: mongoose.ObjectId,
            ref: "All_Catagory",
            required: true,

        },
        quantity: {
            type: Number,
            required: true,
        },
        photo: {
            type: String,
            required: true
        },
        gallery: [
            {
                image_1: {
                    type: String,
                },
                image_2: {
                    type: String,
                },
                image_3: {
                    type: String,
                },
                // image_4: {
                //     type: String,
                // },
            }
        ],
        shipping: {
            type: Boolean,
        },
    },
    { timestamps: true }
);
const ProductDB = new mongoose.model("Products", productSchema);

export default ProductDB;