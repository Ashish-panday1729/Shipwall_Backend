import slugify from "slugify";
import SubCatagory from "../model/Sub-catagory.js";
import mongoose from "mongoose";

// export const addSubCatagory = async (req, res) => {
//     try {
//         const { name, parentCatagory } = req.body;
//         if (!name) {
//             return res.status(404).send({ message: "Name is required!" });
//         }

//         const existingSubCatagory = await SubCatagory.findOne({ name: name });
//         if (existingSubCatagory) {
//             return res.status(404).send({ message: "This Sub-catagory already exists !" });
//         } else {
//             const finalSubCatagory = new SubCatagory({ name, parentCatagory, slug: slugify(name) }).save();
//             res.status(201).send({ success: true, message: "Successfully Created!", data: finalSubCatagory });
//         }

//     } catch (error) {
//         console.log(error);
//         res.status(500).send({ message: "Not created!", error })
//     }
// }

export const addSubCatagory = async (req, res) => {
    try {
        const { name, parentCatagory } = req.body;
        const parentCatagoryObjectId = mongoose.Types.ObjectId(parentCatagory);
        if (!name) {
            return res.status(400).send({ message: "Name is required!" });
        }

        const existingSubCatagory = await SubCatagory.findOne({ name: name });
        if (existingSubCatagory) {
            return res.status(400).send({ message: "This Sub-catagory already exists.Try another one" });
        } else {
            const finalSubCatagory = new SubCatagory({ name, parentCatagory: parentCatagoryObjectId, slug: slugify(name) });
            await finalSubCatagory.save();  // Wait for the save operation to complete
            res.status(201).send({ success: true, message: "Successfully Created!", data: finalSubCatagory });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Failed to create sub-category!", error });
    }
};

export const getallSubCat = async (req, res) => {
    try {
        const allSubCAt = await SubCatagory.find({}).populate("parentCatagory")
        res.status(200).send({ success: true, allSubCAt })
    } catch (error) {
        console.log(error);
    }
};