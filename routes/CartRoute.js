import express from 'express'
import { addToCart, deleteCartData, getYourCartData, updateQuantity } from '../Controller/Cart-controller.js';
import { cusAuth } from '../middleware.js/cusAuth.js';
const Cart_router = express.Router();


Cart_router.post("/api/v1/add-to-cart", cusAuth, addToCart);

Cart_router.post("/api/cart/update-quantity", cusAuth, updateQuantity);

Cart_router.delete("/api/v1/delete-cart", deleteCartData);

Cart_router.get("/api/v1/get/cart-data", cusAuth, getYourCartData);

export default Cart_router

