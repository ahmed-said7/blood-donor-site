let express= require('express');
let router=express.Router();

const {getLoggedUser,updateLoggedUser,changeLoggedUserPassword,
    deleteLoggedUser,setPasswordToNull}=require('../services/userServices');
const {allowedTo,login,signup,protect}=require('../services/authServices');


router.route('/signup').post(signup);

router.route('/login').post(login);

router.use(protect,allowedTo('user','admin','manager'))

router.route('/get-me')
    .get(getLoggedUser);

router.route('/update-me').patch(setPasswordToNull,updateLoggedUser);

router.route('/update-password').patch(changeLoggedUserPassword);

router.route('/delete-me').delete(deleteLoggedUser);

module.exports=router;