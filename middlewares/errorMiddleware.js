const apiError = require('../utils/apiError');

require('dotenv').config();

const prodErrorFunc=(error,res)=>{
    if(error.isOperational){
        res.status(400).json({
            statusCode: 400,
            message:error.message
        });
    }else{
        res.status(400).json({
            statusCode: 400,
            message:"some thing went wrong"
        });
    }
};
const devErrorFunc=(error,res)=>{
    res.status(error.statusCode).json({
        error,message:error.message,stack:error.stack
    });
};

const handleErrorFunc=(err)=>{
    let errors={...err};
    if(err.name == "ValidationError"){
        const message =Object.values(err.errors).map((ele)=>ele.message);
        errors=new apiError(`validations ${message.join('&')}`,400);
    };
    if(err.name == "CastError"){
        const message =err.message;
        errors=new apiError(message,400);
    };
    if(err.code == 11000){
        const message =err.message;
        errors=new apiError(message,400);
    };
    return errors;
};


const errorMiddleware=(err,req,res,next)=>{
    err.statusCode=err.statusCode || 400;
    if(process.env.NODE_ENV == "development"){
        devErrorFunc(err,res);
    }else if(process.env.NODE_ENV == 'production'){
        const error=handleErrorFunc(err);
        prodErrorFunc(error,res);
    };
};

module.exports=errorMiddleware;