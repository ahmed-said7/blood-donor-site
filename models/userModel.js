const mongoose = require('mongoose');
const bcrypt= require("bcryptjs");
const userSchema=new mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{
            type:String,
            unique:true,
            required:true
        },
        password:{
            type:String,
            required:true,
            minlength:6,
            maxlength:300
        },
        role:{
            type:String,
            enum:["organization","hospital","donor","patient","admin"],
            default:"admin"
        },
        owner:String,
        phone:String,
        website:String,
        address:String,
        passwordChangedAt:Date
    },
    {timestamps:true});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    };
    this.password =await bcrypt.hash(this.password,12);
    next();
});

const userModel=mongoose.model('User',userSchema);
module.exports=userModel;