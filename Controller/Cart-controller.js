import CartDB from "../model/CartSchema.js";
import mongoose from "mongoose";
import ProductDB from "../model/ProductSchema.js";


// add to cart
export const addToCart = async (req, res) => {
    try {
        const { productID, quantity } = req.body;
        const product_ID = mongoose.Types.ObjectId(productID);
        // const product_name = mongoose.Types.ObjectId(productName);

        if (!productID) {
            res.status(404).send({ message: "Product_id is required!" })
        }

        if (!quantity) {
            res.status(404).send({ message: "Product_quantity is required!" })
        }

        const checkProduct = await ProductDB.findOne({ _id: productID });
        if (checkProduct) {
            // console.log(checkProduct);
            // const price = 0;
            const checkProductInCart = await CartDB.findOne({ productID: productID });
            if (checkProductInCart) {
                res.status(400).send({ message: "This product is already in your cart" });
            } else {
                const cartData = new CartDB({ productID: product_ID, quantity, productName: checkProduct.name, photo: checkProduct.photo, addedBy: req.userId })
                await cartData.save();
                res.status(200).send({ message: "Product is added to cart successfully!", cartData });
            }


        } else {
            console.log("Product nt found!!")
        }


    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server error" });
    }
};

// Update quantity

export const updateQuantity = async (req, res) => {
    try {
        const { id } = req.body;
        const { quantity } = req.body;


        const cartItem = await CartDB.findOne({ productID: id });

        if (!cartItem) {
            return res.status(404).json({ message: "Product not found in the cart" });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        res.status(200).json({
            message: "Quantity updated successfully!",
            updatedProduct: cartItem
        });
    } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete cart
export const deleteCartData = async (req, res) => {
    try {
        const { id } = req.body;

        const checkCart = await CartDB.findOne({ productID: id });

        if (!checkCart) {
            res.status(404).send({ message: "Product not found in your cart" })
        } else {
            // console.log(checkCart.productID)
            // const deleteData = await CartDB.findByIdAndDelete({ productID: checkCart.productID });
            const deleteData = await CartDB.findByIdAndDelete(checkCart._id);
            res.status(200).send({ success: true, message: "Data deleted!" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// get your cart-data
export const getYourCartData = async (req, res) => {
    try {
        const user = req.userId;
        const cartData = await CartDB.find({ addedBy: user });
        res.status(200).send({ success: true, data: cartData });
    } catch (error) {
        console.log(error);
    }
};