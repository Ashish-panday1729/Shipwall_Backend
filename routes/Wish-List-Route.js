import express from 'express'
import { addWishList, getWishList, removeWishList } from '../Controller/WishList.js';
import { cusAuth } from '../middleware.js/cusAuth.js';
const wishList_router = express.Router();

wishList_router.post("/api/v1/add/wish-list", cusAuth, addWishList);

wishList_router.delete("/api/v1/delete-wishList-item", removeWishList);

wishList_router.get("/api/v1/get/wish-list", cusAuth, getWishList);

export default wishList_router;