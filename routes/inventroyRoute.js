const express= require('express');
let router=express.Router();

const {getInventroy,getAllUniqueDonors,getInventroies,setFilterObj,getInventroiesAggregation,
    deleteInventroy,createInventroy,updateInventroy,setOrganizationIdToBody}
    =require("../services/inventroyServices");

const {allowedTo,protect}=require('../services/authServices');



router.use(protect);

router.route('/').
    get(setFilterObj,getAllUniqueDonors).
    post(allowedTo('admin','organization'),
        setOrganizationIdToBody,createInventroy);

router.route('/:id')
    .patch(allowedTo('admin','organization'),updateInventroy)
    .get(setFilterObj,getInventroy).
    delete(allowedTo('admin','organization'),deleteInventroy);

module.exports = router;