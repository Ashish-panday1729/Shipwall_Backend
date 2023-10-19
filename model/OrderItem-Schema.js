import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
    productID: {
        required: true,
        type: mongoose.ObjectId,
        ref: "add_to_cart"
    },
    orderID: {
        type: mongoose.ObjectId,
        ref: "Order",
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
});
const OrderItemDB = new mongoose.model("Order_item", orderItemSchema);
export default OrderItemDB;