import Catagory from "../model/CatagorySchema.js";
import slugify from "slugify";
import cloudinary from 'cloudinary';
import ProductDB from "../model/ProductSchema.js";


export const createCatagory = async (req, res) => {
    try {
        const { name, sub_catagory, } = req.body;
        const file = req.file;

        const existingCatagory = await Catagory.findOne({ name });
        if (existingCatagory) {
            return res.status(400).send({
                success: false,
                message: "This Catagory already exists!"
            })
        }

        if (!name) {
            res.status(404).send({ message: "Catagory name is required!" });
        } else {

            const uploadResult = await cloudinary.v2.uploader.upload(file.path);
            const catagoryData = await Catagory({
                name,
                slug: slugify(name),
                catagoryIimage: uploadResult.secure_url,
                sub_catagories: [{ sub_name: sub_catagory }]
            }).save();
            res.status(201).send({ success: true, data: catagoryData })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Server error!" });
    }
};



// update catgory
export const updateCatagory = async (req, res) => {
    try {
        const { parent_catagory, sub_catagory, } = req.body;
        const file = req.file;
        const { id } = req.params;

        const uploadResult = await cloudinary.v2.uploader.upload(file.path);

        const catagory = await Catagory.findByIdAndUpdate({ _id: id },
            { parent_catagory, slug: slugify(parent_catagory), catagoryIimage: uploadResult.secure_url, sub_catagories: [{ name: sub_catagory }] },
            { new: true });

        res.status(201).send({ success: true, message: "Catagory updated successfully", catagory });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while updating category", error });
    }
};

// get all catagory 
export const getCatagory = async (req, res) => {
    try {
        // const search = req.query.search;

        // const query = {
        //     name: { $regex: search, $options: "i" }
        // }
        const allCatagory = await Catagory.find({})
        // const allCatagory = await Catagory.find({})

        const Total_data = await Catagory.count();
        res.status(200).send({ success: true, Total_data, allCatagory });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting category", error });
    }
};


// single catagory
export const getSingleCatagory = async (req, res) => {
    try {
        const catagory = await Catagory.findOne({ _id: req.params.id })
        res.status(201).send({
            success: true,
            message: "Successfully get a single catagory",
            catagory
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting a single category", error });
    }
};


// delete catagory
export const deleteSingleCatagory = async (req, res) => {
    try {
        const { id } = req.params;

        // changes (check product of the catagory exists or not)
        const checkInProduct = await ProductDB.findOne({ category: id });
        if (checkInProduct) {
            res.status(400).send({ message: "Unable to delete! Product of this catagory exists in DB." })
        } else {
            await Catagory.findByIdAndDelete({ _id: id });
            res.status(200).send({
                success: true,
                message: "Categry Deleted Successfully",
            });
        }
        // changes completes

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while deleting a single category", error });
    }
};


export const test = async (req, res) => {
    try {
        // const { name, subcategories } = req.body;
        const file = req.file;
        console.log(file);
        res.send("Ok!")
    } catch (error) {
        res.send(error)
        console.log(error);
    }
}
