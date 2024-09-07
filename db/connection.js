const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_DB)
                .then(()=>{
                    console.log('Mongo DB connected')
                })
                .catch((err)=>{
                    console.log(err)
                })