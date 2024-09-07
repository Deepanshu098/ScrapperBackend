const express = require('express');
const { scrapeData, companyDetails } = require('../controller/companyController');
const companyRouter = express.Router();

companyRouter.post('/scrape',scrapeData)
companyRouter.get('/company/:id',companyDetails)


module.exports = companyRouter;