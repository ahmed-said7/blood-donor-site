const mongoose=require('mongoose');
require('dotenv').config();

const dbConnect=()=>{
    mongoose.connect(process.env.url).then(()=>{
        console.log('Connected To Database Successfully')
    });
};
module.exports=dbConnect;
