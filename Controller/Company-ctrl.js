import CompanyDB from "../model/Company_Schema.js";

// Register a company
export const regCompany = async (req, res) => {
    const { companyname, mobile, email, address, pincode, city, country, countrycode } = req.body;

    if (!companyname || !mobile || !email || !address || !pincode || !city || !country || !countrycode) {
        res.status(422).json({ error: 'Fill all the details.' });
        return;
    }

    try {
        const newCompany = new CompanyDB({
            companyname,
            mobile,
            email,
            address,
            pincode,
            city,
            country,
            countrycode,
        });

        await newCompany.save();
        res.status(201).json({ message: 'Successfully Added', newCompany });
    } catch (error) {
        res.status(401).json(error);
    }
};
// get all company
export const getAllCompanyData = async (req, res) => {
    try {
        // Pegignation 
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const size = req.query.size ? parseInt(req.query.size) : 4;

        const skip = (page - 1) * size;


        const total = await CompanyDB.countDocuments();

        const companies = await CompanyDB.find({})
            .skip(skip)
            .limit(size);
        res.status(200).json({ records: companies, total, page, size });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};