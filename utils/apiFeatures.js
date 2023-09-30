const { json } = require("express");

class apiFeatures {
    constructor(query,queryObject){
        this.query = query;
        this.queryObject = queryObject;
    }
    filter(Obj={}){
        let query={...this.queryObject,...Obj};
        let excluded_fields=['page','sort','limit','select',"keyword"];
        excluded_fields.forEach((field)=>{delete query[field];});
        let queryString=JSON.stringify(query);
        queryString=queryString.replace( /gt|lt|gte|lte/ig , (val) => `$${val}` );
        query=JSON.parse(queryString);
        this.query=this.query.find(query);
        return this;
    };
    selectFields(){
        if(this.queryObject.select){
            let select=this.queryObject.select.split(',').join(' ');
            this.query=this.query.select(select);
        }
        return this;
    };
    sort(){
        if(this.queryObject.sort){
            let sort=this.queryObject.sort.split(',').join(' ');
            this.query=this.query.sort(sort);
        }else{
            this.query=this.query.sort("-updatedAt");
        };
        return this;
    };
    search(){
        if(this.query.keyword){
            this.query=this.query.find({name:{$regex:this.query.keyword,$options:"si"}})
        };
        return this;
    };
    pagination(endIndex){
        const Obj={};
        let page=this.queryObject.page*1 || 1;
        let limit=this.queryObject.limit*1 || 10;
        Obj.numOfPages=Math.ceil(endIndex / limit);
        if(endIndex > page*limit){
            Obj.nextPage=page+1;
        };
        if(page>1){
            Obj.previousPage=page-1;
        };
        let skip=(page-1)*limit;
        Obj.currentPage=page;
        Obj.limit=limit;
        Obj.numOfDocs=endIndex;
        this.Obj=Obj;
        this.query=this.query.skip(skip).limit(limit);
        return this;
    };
};

module.exports=apiFeatures;