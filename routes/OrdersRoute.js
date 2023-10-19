import express from 'express'
import { cusAuth } from '../middleware.js/cusAuth.js';
import { orderPlaced } from '../Controller/Order-Controller.js';
const order_router = express.Router();


order_router.post("/api/v1/order", cusAuth, orderPlaced);


export default order_router