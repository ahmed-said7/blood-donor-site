// let User=require('../models/userModel')
const {getAll,getOne,deleteOne,createOne}=require('../utils/apiFactory');
const User=require('../models/userModel');
const handler=require("express-async-handler");
const dotenv=require("dotenv");
dotenv.config();

const getUsers=getAll(User);
const deleteUser=deleteOne(User);
const getUser=getOne(User);
const createUser=createOne(User);

let updateUser=handler(async(req,res,next)=>{
    let user=await User.findByIdAndUpdate( req.params.id, req.body , {new:true} );
    if(!user){
        return new Error('User not found')
    };
    res.status(200).json({updatedUser:user})
});

let changeUserPassword=handler(async(req,res,next)=>{
    let user=await User.findById(req.params.id)
    if(!user){
        return new Error('User not found')
    }
    user.password = req.body.password;
    user.passwordChangedAt=Date.now();
    await user.save()
    res.status(200).json({updatedUser:user})
});

let getLoggedUser=handler(async(req,res,next)=>{
    res.status(200).json({loggedUser:req.user});
});

let updateLoggedUser=handler(async(req,res,next)=>{
    let user=await User.findByIdAndUpdate( req.user._id , req.body, {new:true})
    res.status(200).json({updatedUser:user})
});

let changeLoggedUserPassword=handler(async(req,res,next)=>{
    let user=await User.findById(req.user._id);
    user.password=req.body.password;
    user.passwordChangedAt=Date.now();
    await user.save();
    res.status(200).json({user});
});

let deleteLoggedUser=handler(async(req,res,next)=>{
    let user=await User.findByIdAndDelete(req.user._id);
    res.status(200).json({deletedUser:user})
});

const setPasswordToNull=handler(async(req,res,next)=>{
    if(req.body.password){
        req.body.password = undefined;
    };
    return next();
});
module.exports={getLoggedUser,updateLoggedUser,changeLoggedUserPassword,
    deleteLoggedUser,changeUserPassword,
    updateUser,createUser,getUsers,deleteUser,getUser,setPasswordToNull};