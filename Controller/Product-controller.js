import slugify from 'slugify';
import cloudinary from 'cloudinary';
import ProductDB from '../model/ProductSchema.js';
import Catagory from '../model/CatagorySchema.js';
import CartDB from '../model/CartSchema.js';





export const addProduct = async (req, res) => {
    try {
        const { name, description, long_description, price, category, quantity, shipping } = req.body;
        const filePhoto = req.files['photo'][0];
        const fileImage1 = req.files['image_1'][0];
        const fileImage2 = req.files['image_2'][0];
        const fileImage3 = req.files['image_3'][0];
        // const fileImage4 = req.files['image_4'][0];

        if (!name || !description || !price || !category || !quantity) {
            return res.status(400).send({ error: "All required fields must be provided" });
        }

        if (!filePhoto || !fileImage1 || !fileImage2 || !fileImage3) {
            return res.status(400).send({ error: "All images are required" });
        }

        const uploadResultPhoto = await cloudinary.v2.uploader.upload(filePhoto.path);
        const uploadResultImage1 = await cloudinary.v2.uploader.upload(fileImage1.path);
        const uploadResultImage2 = await cloudinary.v2.uploader.upload(fileImage2.path);
        const uploadResultImage3 = await cloudinary.v2.uploader.upload(fileImage3.path);
        // const uploadResultImage4 = await cloudinary.v2.uploader.upload(fileImage4.path);

        const products = await ProductDB({
            name, description, long_description, price, category, quantity, shipping, slug: slugify(name),
            photo: uploadResultPhoto.secure_url,
            gallery: [
                { image_1: uploadResultImage1.secure_url },
                { image_2: uploadResultImage2.secure_url },
                { image_3: uploadResultImage3.secure_url },
                // { image_4: uploadResultImage4.secure_url }
            ]
        });

        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while Creating product!", error });
    }
}


//get all products
export const getAllProducts = async (req, res) => {
    const page = req.query.page || 1;
    const ITEM_PER_PAGE = req.query.limit || 3;
    const skip = (page - 1) * ITEM_PER_PAGE;


    try {
        const products = await ProductDB
            .find({})
            .populate("category")
            .limit(ITEM_PER_PAGE)
            .skip(skip)
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "All products",
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting all products!" });
    }
};

// get all products by search
export const getProductsBySearch = async (req, res) => {

    try {
        const search = req.query.search || "";
        const categoryName = req.query.category;

        let categoryObjectId;
        if (categoryName) {
            // Assuming you have a CategoryDB model with a field `name` for category names
            const category = await Catagory.findOne({ name: categoryName });
            if (!category) {
                return res.status(404).send({ success: false, message: "Category not found" });
            }
            categoryObjectId = category._id;
        }

        const query = {
            name: { $regex: search, $options: "i" },
            category: categoryObjectId
        };

        const total_products = await ProductDB.countDocuments(query);
        const getSearchedData = await ProductDB.find(query);

        res.status(200).send({ success: true, total_products, data: getSearchedData });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
};

// All product at a time
export const getProducts = async (req, res) => {
    try {
        const Total = await ProductDB.count();
        const Products = await ProductDB.find({}).populate("category");
        res.status(200).send({
            success: true,
            countTotal: Total,
            message: "All products",
            Products
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({ success: false, message: "Error while getting all products!" });

    }
}



// single product api
export const getSingleProduct = async (req, res) => {
    try {
        const product = await ProductDB.findOne({ _id: req.params.id }).populate("category");
        res.status(200).send({
            success: true,
            message: "Single Product",
            product
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while getting a single product!" });
    }
};


// delete a single product 
export const deleteSingleProduct = async (req, res) => {
    try {
        const deleteProduct = await ProductDB.findByIdAndDelete({ _id: req.params.id });

        const deleteFromCart = await CartDB.findOneAndDelete({ productID: req.params.id });
        // console.log(deleteFromCart)
        if (deleteProduct || deleteFromCart) {
            res.status(200).send({ success: true, message: "This product is also deleted from customer's cart.", data: deleteFromCart, productDelete: deleteProduct });
        } else {
            res.status(400).send({ success: false });
        }


        // res.status(200).send({ success: true, message: "Successfully product deleted.", deleteProduct });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while deleting a product!" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { name, description, long_description, price, category, quantity, shipping } = req.body;
        const filePhoto = req.files['photo'][0];
        const fileImage1 = req.files['image_1'][0];
        const fileImage2 = req.files['image_2'][0];
        const fileImage3 = req.files['image_3'][0];
        // const fileImage4 = req.files['image_4'][0];

        if (!name || !description || !price || !category || !quantity) {
            return res.status(400).send({ error: "All required fields must be provided" });
        }

        if (!filePhoto || !fileImage1 || !fileImage2 || !fileImage3) {
            return res.status(400).send({ error: "All images are required" });
        }

        const uploadResultPhoto = await cloudinary.v2.uploader.upload(filePhoto.path);
        const uploadResultImage1 = await cloudinary.v2.uploader.upload(fileImage1.path);
        const uploadResultImage2 = await cloudinary.v2.uploader.upload(fileImage2.path);
        const uploadResultImage3 = await cloudinary.v2.uploader.upload(fileImage3.path);
        // const uploadResultImage4 = await cloudinary.v2.uploader.upload(fileImage4.path);


        // const uploadResult = await cloudinary.v2.uploader.upload(file.path);

        const products = await ProductDB.findByIdAndUpdate(
            { _id: req.params.id },
            {
                name, description, long_description, price, category, quantity, shipping, slug: slugify(name),
                photo: uploadResultPhoto.secure_url,
                gallery: [
                    { image_1: uploadResultImage1.secure_url },
                    { image_2: uploadResultImage2.secure_url },
                    { image_3: uploadResultImage3.secure_url },
                    // { image_4: uploadResultImage4.secure_url }
                ]
            },
            { new: true }
        );

        if (!products) {
            return res.status(404).send({ success: false, message: "Product not found" });
        }

        await products.save();
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error while updating product!" });
    }
};

//filter-products
export const filterProducts = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {};
        if (checked.length > 0) args.Catagory = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await ProductDB.find(args);
        res.status(200).send({
            success: true,
            products,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in filter", error })
    }
};