import multer from "multer";

// storage config
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./uploads")
    },
    filename: (req, file, callback) => {
        const filename = `image${Date.now()}.${file.originalname}`
        callback(null, filename);
    }
});

// filter
const fileFilter = (req, file, callback) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        callback(null, true)
    } else {
        // return callback(null, false(new Error("Only .jpg .jpeg & .png formatted are allowed")));
       return callback(new Error("Only .jpg, .jpeg, and .png formats are allowed"));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

export default upload;