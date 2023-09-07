import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyname: String,
    mobile: String,
    email: String,
    address: String,
    pincode: String,
    city: String,
    country: String,
    countrycode: String
});

const CompanyDB = mongoose.model("Company_list", companySchema);

export default CompanyDB