import mongoose from "mongoose";
import WishListDB from "../model/WishList-Schema.js";
import ProductDB from "../model/ProductSchema.js";

// add to wish list
export const addWishList = async (req, res) => {
    try {
        const { productID } = req.body;

        if (!productID) {
            res.status(400).send({ message: "Product_id is required!" });
            return;
        }

        if (!mongoose.isValidObjectId(productID)) {
            res.status(400).send({ message: "Invalid productID format!" });
            return;
        }

        const myProduct = await ProductDB.findById(productID);
        console.log(myProduct)

        if (myProduct) {
            const preData = await WishListDB.findOne({ productID: myProduct._id });
            if (preData) {
                res.status(400).send({ message: "This product is already in your Wish-List!" });
            } else {
                const storeData = new WishListDB({
                    productID: myProduct._id,
                    productName: myProduct.name,
                    photo: myProduct.photo,
                    category: myProduct.category,
                    addedBy: req.userId,
                });

                await storeData.save();
                res.status(200).send({ message: "Product Added to WishList!", data: storeData });
            }
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
};

// delete wishlist
export const removeWishList = async (req, res) => {
    try {
        const { id } = req.body;

        const checkWishList = await WishListDB.findOne({ productID: id });

        if (!checkWishList) {
            res.status(200).send({ message: "This product is not in your Wish-List!" });
        } else {
            const deleteData = await WishListDB.deleteOne(checkWishList._id);
            res.status(200).send({ success: true, message: "Product deleted from your Wish-List" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
};

// get wish-list 
export const getWishList = async (req, res) => {
    try {
        const user = req.userId;
        const list = await WishListDB.find({ addedBy: req.userId }).populate("category");
        res.status(200).send({ success: true, list });
    } catch (error) {
        console.log(error);
    }
};