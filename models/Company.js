const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: String,
    description: String,
    logo: String,
    socialLinks: {
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String,
    },
    address: String,
    phone: String,
    email: String,
    screenshot:String,
},{timestamps:true});

const companyModel = mongoose.model('Company',companySchema);

module.exports = companyModel;