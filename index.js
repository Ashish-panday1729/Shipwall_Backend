import express from 'express'
import cors from 'cors'
import Connection from './DB/connection.js';
const port = 9005;
import bodyParser from 'body-parser';
const app = express();
import dotenv from 'dotenv'
import router from './routes/router.js';
import cookieParser from 'cookie-parser';
import Catagory_router from './routes/CatagoryRouter.js';
import product_router from './routes/ProductRoute.js';
import sub_Catagory from './routes/SubCatRoute.js';
import brand_router from './routes/BrandRoutes.js';
import Cart_router from './routes/CartRoute.js';
import wishList_router from './routes/Wish-List-Route.js';
import order_router from './routes/OrdersRoute.js';
import orderItem_router from './routes/OrderItemRoute.js';
import employee from './routes/Seller-EmployeeRoute.js';
import contact from './routes/ContactRoute.js';

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("./uploads"))

//dotenv
dotenv.config();

//Database Connection
Connection();

//Routes
app.use(router);
app.use(Catagory_router);
app.use(product_router);
app.use(sub_Catagory);
app.use(brand_router);
app.use(Cart_router);
app.use(wishList_router);
app.use(order_router);
app.use(orderItem_router);
app.use(employee);
app.use(contact)

app.get("/", (req, res) => {
    res.send("Hello")
});

app.listen(port, () => {
    console.log(`Listning at port ${port}`);
});