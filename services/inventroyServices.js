const {getAll,getOne,deleteOne,createOne,updateOne}=require('../utils/apiFactory');
const Inventroy=require('../models/inventroyModel');
const asyncHandler=require('express-async-handler');
const userModel = require('../models/userModel');
const apiError = require('../utils/apiError');

const getUsersFunc=async(result,res)=>{
    const ids=result.map((ele)=> ele._id);
    const users=await userModel.find({_id:{$in:ids}});
    if(users.length == 0){
        res.status(200).json({status:"no users found"});
    };
    res.status(200).json({users});
};

const getAllUniqueDonors=asyncHandler(async (req,res,next) =>{
    const result= await Inventroy.aggregate([
        { $match:{ type:"in" , organization:req.user._id }},
        { $group : { _id:"$user"  } },
    ]);
    getUsersFunc(result,res);
});

const getAllUniqueHospitals=asyncHandler(async (req,res,next) =>{
    const result= await Inventroy.aggregate([
        { $match:{ type:"out" , organization:req.user._id }},
        { $group : { _id:"$user"  } },
    ]);
    getUsersFunc(result,res);
});

const getAllOrganizationsForHospital=asyncHandler(async (req,res,next) =>{
    const result= await Inventroy.aggregate([
        { $match: {type:"out"}},
        { $group : { _id:"$organization"  } },
    ]);
    getUsersFunc(result,res);
});

const getAllOrganizationsForDonors=asyncHandler(async (req,res,next) =>{
    const result= await Inventroy.aggregate([
        { $match: {type:"in"}},
        { $group : { _id:"$organization"  } },
    ]);
    getUsersFunc(result,res);
});

const getInventroies=getAll(Inventroy);
const deleteInventroy=deleteOne(Inventroy);
const getInventroy=getOne(Inventroy);
const createInventroy=asyncHandler(async(req,res,next)=>{
    const user=await userModel.findById(req.body.user);
    if(req.body.type == "in" &&  user.role != "donor" ) next(new apiError('user should be donor',400))
    if(req.body.type == "out" &&  user.role != "hospital" ) next(new apiError('user should be hospital',400))
    if(req.body.type == "out"){
        const result= await Inventroy.aggregate([
            { $match:{ group:req.body.group , organization:req.user._id }},
            { $group : { _id:"$type" , quantitySum: { $sum : "$quantity" } } },
            {$sort:{quantitySum:-1}}
        ]);
        const inQuantity = result[0]?.quantitySum || 0 ;
        const outQuantity = result[1]?.quantitySum || 0 ;
        const available=inQuantity - outQuantity;
        if(req.body.quantity > available){
            return next(new apiError('quantity not available',400));
        };
    };
    let doc=await Inventroy.create(req.body);
    res.status(200).json({status:"success",result:doc})
    })

    
const updateInventroy=updateOne(Inventroy);

const getInventroiesAggregation=asyncHandler(async (req,res,next) =>{
    const query=["O+","O-","AB","A+","B+","A-","B-"].map( async(ele) => {
        const result= await Inventroy.aggregate([
            { $match:{ group:ele , organization:req.user._id } },
            { $group : { _id:"$type" , quantitySum: { $sum : "$quantity" } } },
            {$sort:{quantitySum:-1}}
        ]);
        if(result.length > 0){
            console.log(result);
            const quantityIn=result[0]?.quantitySum || 0;
            const quantityOut=result[1]?.quantitySum || 0;
            const available =quantityIn-quantityOut;
            return {available,quantityIn,quantityOut,ele};
        }else{
            return {available:0,quantityIn:0,quantityOut:0,ele};
        }
    } )
    const bloodStamp=await Promise.all(query);
    res.status(200).json({bloodStamp});
});


const setFilterObj=asyncHandler(async (req,res,next) =>{
    if(req.user.role == "donor" || req.user.role == "hospital"){
        req.filterObj={user:req.user._id};
    }else if(req.user.role == "organization"){
        req.filterObj={organization:req.user._id};
    };
    next();
});

const setOrganizationIdToBody=asyncHandler(async (req,res,next) =>{
    if(!req.body.organization){
        req.body.organization=req.user._id;
    };
    next();
});

module.exports={getAllUniqueHospitals,getAllOrganizationsForHospital,
    getAllOrganizationsForDonors,
    getInventroy,getInventroies,setFilterObj,setFilterObj,getAllUniqueDonors,
    deleteInventroy,createInventroy,updateInventroy,setOrganizationIdToBody,getInventroiesAggregation};