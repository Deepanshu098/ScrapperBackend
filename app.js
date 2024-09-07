require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const companyRouter = require('./routes/CompanyRouter');
// const path = require('path')
const app = express();
require('./db/connection')

app.use('/screenshots', express.static(__dirname+'/screenshots'));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

app.use('/api',companyRouter)

app.get('/',(req,res)=>{
    res.send('Server started')
})


module.exports=app;