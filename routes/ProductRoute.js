import express from 'express'
import { addProduct, deleteSingleProduct, filterProducts, getAllProducts, getProducts, getProductsBySearch, getSingleProduct, updateProduct } from '../Controller/Product-controller.js';
import upload from '../multerConfig/storageConfig.js';
import { authenticate } from '../middleware.js/Authentication.js';
import uploadGallery from '../multerConfig/galeryconfig.js';
const product_router = express.Router();

// product_router.post("/api/products/create-product", authenticate, upload.single("photo"), upload.array("gallary"), createProduct);


product_router.post("/api/v1/add-product", authenticate, upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'image_1', maxCount: 1 },
    { name: 'image_2', maxCount: 1 },
    { name: 'image_3', maxCount: 1 },
    // { name: 'image_4', maxCount: 1 }
]), addProduct);



product_router.get("/api/all-products", getAllProducts);

// search product api
product_router.get("/api/search-products", getProductsBySearch);

product_router.get("/api/v1/all/products", getProducts)

product_router.get("/api/get/single-product/:id", getSingleProduct);

product_router.delete("/api/delete-product/:id", authenticate, deleteSingleProduct);

product_router.post("/api/v1/update-product/:id", authenticate, upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'image_1', maxCount: 1 },
    { name: 'image_2', maxCount: 1 },
    { name: 'image_3', maxCount: 1 },
    // { name: 'image_4', maxCount: 1 }
]), updateProduct);

// filter-products
product_router.post("/api/v1/filter-product", filterProducts);


product_router.post("/api", (req, res) => {
    console.log(req.body)
})

export default product_router;
