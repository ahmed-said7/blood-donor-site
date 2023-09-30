let express= require('express');
let router=express.Router();

const {allowedTo,protect}=require('../services/authServices');
const{changeUserPassword,
        updateUser,createUser,
        getUsers,deleteUser,getUser,setPasswordToNull}=require('../services/userServices');

router.use(protect,allowedTo('admin','manager'))


router.route('/').post(createUser)
    .get(getUsers);


router.route('/:id').get(getUser)
    .delete(deleteUser)
    .patch(setPasswordToNull,updateUser);

router.route('/update-password/:id').patch(changeUserPassword);

module.exports=router;