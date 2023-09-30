const mongoose=require('mongoose');
const inventroySchema=new mongoose.Schema({

    type:{
        type:String,
        enum:["in","out"],
        required:true
    },

    group:{
        type:String,
        enum:["O+","O-","AB","A+","B+","A-","B-"],
        required:true
    },

    quantity:{
        type:Number,
        required:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    organization:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{

    timestamps:true

});

inventroySchema.pre(/^find/ig,function(next){
    this.populate([{path:"organization"},{path:"user"}]);
    next();

});

const inventroyModel=mongoose.model("Inventroy",inventroySchema);

module.exports = inventroyModel;

