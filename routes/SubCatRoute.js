import express from 'express'
import { addSubCatagory, getallSubCat } from '../Controller/Sub-catController.js';
import { authenticate } from '../middleware.js/Authentication.js';
const sub_Catagory = express.Router();

sub_Catagory.post("/api/sub-catagory", authenticate, addSubCatagory);

sub_Catagory.get("/api/get-subcatagory", getallSubCat)

export default sub_Catagory