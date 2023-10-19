import express from 'express'
import { sendMessage } from '../Controller/Contact-controller.js';
const contact = express.Router();


contact.post("/api/v1/contact", sendMessage);

export default contact