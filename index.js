import express from 'express'
import cors from 'cors'
import Connection from './DB/connection.js';
const port = 9005;
const app = express();
import dotenv from 'dotenv'
import router from './routes/router.js';
import cookieParser from 'cookie-parser';

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/uploads", express.static("./uploads"))

//dotenv
dotenv.config();

//Database Connection
Connection();

//Routes
app.use(router);

app.get("/", (req, res) => {
    res.send("Hello")
});

app.listen(port, () => {
    console.log(`Listning at port ${port}`);
});