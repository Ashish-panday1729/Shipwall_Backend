import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    // productID: {
    //     required: true,
    //     type: mongoose.ObjectId,
    //     ref: "add_to_cart"
    // },
    // productName: {
    //     type: String,
    //     required: true
    // },
    orderValue: {
        required: true,
        type: String
    },
    quantity: {
        type: String,
        // required: true
    },
    // photo: {
    //     type: String,
    // },
    orderStatus: {
        type: String,
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        default: 'pending'
    },
    addedBy: {
        type: String,
        required: true
    }
}, { timestamps: true });

const OrderDB = new mongoose.model("Order", orderSchema);
export default OrderDB;