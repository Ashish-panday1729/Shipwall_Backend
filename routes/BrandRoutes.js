import express from 'express'
import { createBrand, getBrands } from '../Controller/Brand-Controller.js';
import upload from '../multerConfig/storageConfig.js';

const brand_router = express.Router();

brand_router.post("/api/brands/create", upload.single("brandimage"), createBrand);

brand_router.get("/api/brands/get-brands", getBrands)

export default brand_router