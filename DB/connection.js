import mongoose from "mongoose";

const Connection = async () => {
    // MONGO_ATLAS, MONGO_URL
    try {
        await mongoose.connect(process.env.MONGO_ATLAS);
        // await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connected successfully!");
    } catch (error) {
        console.log(error)
    }
}
export default Connection
