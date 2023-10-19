import mongoose from 'mongoose'

const cartSchema = ({
    productID: {
        required: true,
        ref: "Products",
        type: mongoose.ObjectId,
    },

    quantity: {
        type: String,
        required: true
    },
    productName: {
        type: String
    },
    photo: {
        type: String
    },
    totalPrice: {
        type: String,
    },
    addedBy: {
        required: true,
        type: mongoose.ObjectId,
        ref: "user"
    },
    dateCreated: Date,
});

const CartDB = new mongoose.model("add_to_cart", cartSchema);
export default CartDB;
