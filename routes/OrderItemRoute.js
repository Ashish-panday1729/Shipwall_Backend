import express from 'express'
import { orderPlacedItems } from '../Controller/OrderItem-controller.js';
import { cusAuth } from '../middleware.js/cusAuth.js';

const orderItem_router = express.Router();

orderItem_router.post("api/v1/order-item", cusAuth, orderPlacedItems);

export default orderItem_router;

