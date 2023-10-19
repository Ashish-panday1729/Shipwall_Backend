import OrderDB from "../model/OrderSchema.js";

export const orderPlacedItems = async (req, res) => {
    try {
        const { productID } = req.body;

        // getting order id from order table
        const orderTable = await OrderDB.findOne({})
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
};