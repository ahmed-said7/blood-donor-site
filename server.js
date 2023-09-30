const express=require('express');
const morgan = require('morgan');
const dotenv=require('dotenv');

dotenv.config();
require('./config/db')();
const app=express();
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

app.use(express.json());
const userRouter=require('./routes/userRoutes');
let inventoryRouter=require('./routes/inventroyRoute');
const authRouter=require("./routes/authRoutes");
const apiError = require('./utils/apiError');
const errorMiddleware = require('./middlewares/errorMiddleware');

app.use('/api/v1/user' , userRouter );
app.use('/api/v1/auth' , authRouter );
app.use('/api/v1/inventory',inventoryRouter);

app.all("*",(req,res,next)=>{
    return next(new apiError('route not found',400));
})

app.use(errorMiddleware)

const server=app.listen(3000,()=>{
    console.log('listening on port 3000');
});

process.on('uncaughtException',(err)=>{
    console.log('uncaught exception' + err);
    server.close(()=>{
        process.exit(1);
    });
});

process.on("unhandledRejection",(err)=>{
    console.log('unhandled rejecton' + err);
    server.close(()=>{
        process.exit(1);
    });
});