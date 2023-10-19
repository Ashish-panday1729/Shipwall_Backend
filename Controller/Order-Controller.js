import CartDB from "../model/CartSchema.js";
import OrderDB from "../model/OrderSchema.js";
import ProductDB from "../model/ProductSchema.js";

export const orderPlaced = async (req, res) => {
    try {
        const { productID } = req.body;

        //Check price from ProductDB
        const productPrice = await ProductDB.findOne({ _id: productID });
        // console.log("Price : ", productPrice)

        // check quantity from cart table
        const productQuantity = await CartDB.findOne({ productID: productID });
        // console.log("Quantity : ", productQuantity);

        const finalOrder = await OrderDB({
            // productID,
            orderValue: productPrice.price,
            quantity: productQuantity.quantity,
            addedBy: req.userId
        }).save();

        res.status(200).send({ success: true, message: "order has placed.Now do payment!", data: finalOrder })


    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error!" })
    }
}