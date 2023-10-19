import cloudinary from 'cloudinary';
import BrandDB from '../model/BrandSchema.js';

export const createBrand = async (req, res) => {
    try {
        const { brandname, status } = req.body;

        if (!brandname) {
            res.status(400).send({ message: "Brand name is required!" });
            return;
        }

        if (!status) {
            res.status(400).send({ message: "Status is required!" });
            return;
        }

        const file = req.file;
        // console.log("FileData : ", file)

        if (!file) {
            return res.status(400).send({ error: "Photo is required" });
        }

        const uploadResult = await cloudinary.v2.uploader.upload(file.path);

        const brandData = new BrandDB({
            brandname,
            status,
            brandimage: uploadResult.secure_url
        });
        await brandData.save();
        res.status(201).send({
            success: true,
            message: "Brand Created Successfully",
            brandData
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" });
    }
};

export const getBrands = async (req, res) => {
    try {
        const brands = await BrandDB.find({});
        res.status(200).send({ success: true, data: brands })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Internal Server Error" }, error);
    }
}