let User=require('../models/userModel');
let bcrybt=require("bcryptjs");
let handler=require("express-async-handler");
const apiError = require('../utils/apiError');
let jwt=require("jsonwebtoken");
let dotenv = require("dotenv");
dotenv.config();


let login=handler(
    async(req,res,next)=>{
        let user=await User.findOne({email:req.body.email});
        if(!user){
            return next(new apiError('no user found for this email',400));
        }
        const valid =await bcrybt.compare(req.body.password,user.password);
        if(! valid){
            return next(new apiError('email or password is not correct',400));
        }
        let token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"30d"});
        res.status(200).json({token:"bearer "+token ,user});
    }
)

let signup=handler(
    async(req,res,next)=>{
        let user=await User.create(req.body);
        if(!user){
            return next(new apiError('no user found for this email',400));
        }
        let token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"20d"});
        res.status(200).json({token:"bearer "+token ,user});
    }
)

let protect=handler(
    async(req,res,next)=>{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){
            token=req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return next(new apiError("no token found",400))
        };
        const decoded=jwt.verify(token,process.env.SECRET);
        let currentUser=await User.findById(decoded.userId);
        if(!currentUser){
            return next(new apiError("no user found",400))
        }
        if(currentUser.passwordChangedAt){
            let stamp=Math.floor(currentUser.passwordChangedAt/1000);
            if(stamp>decoded.iat){
                return next(new apiError("user password changed",400))
            }
        }
        req.user=currentUser;
        next();
    }
)

let allowedTo=(...roles)=> handler(async (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new apiError(`you are  not allowed to access this route only allowed to ${roles}` ),400)
        }
        next();
});

module.exports={allowedTo,protect,login,signup};