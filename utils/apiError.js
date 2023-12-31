
class apiError extends Error {
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${this.statusCode}`.startsWith('4') ? "failed" : "error" ;
        this.isOperational=true;
    };
};

module.exports=apiError;