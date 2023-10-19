import express from 'express'
import { createCatagory, deleteSingleCatagory, getCatagory, getSingleCatagory, test, updateCatagory } from '../Controller/CatagoryController.js';
import { authenticate } from '../middleware.js/Authentication.js';
import upload from '../multerConfig/storageConfig.js';
const Catagory_router = express.Router();

Catagory_router.post("/api/v1/create-catagory", upload.single("catagoryIimage"), createCatagory);

Catagory_router.post("/api/v1/update-catagory/:id", upload.single("catagoryIimage"), authenticate, updateCatagory);

Catagory_router.get("/api/v1/all-catagories", getCatagory);

Catagory_router.get("/api/v1/single-catagory/:id", getSingleCatagory);

Catagory_router.delete("/api/v1/delete-category/:id", authenticate, deleteSingleCatagory);

Catagory_router.post("/test", test)


export default Catagory_router;