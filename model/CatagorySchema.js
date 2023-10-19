import mongoose from 'mongoose'

const catagorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        lowercase: true
    },
    catagoryIimage: {
        type: String,
        required: true
    },

    sub_catagories: [{
        sub_name: {
            type: String,
            trim: true
        }

    }]
});

const Catagory = new mongoose.model("All_Catagory", catagorySchema);
export default Catagory;
