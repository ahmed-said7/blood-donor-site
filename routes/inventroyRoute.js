const express= require('express');
let router=express.Router();

const {
    getAllUniqueHospitals,getAllOrganizationsForHospital,
    getAllOrganizationsForDonors,
    getInventroy,getInventroies,setFilterObj,
    setFilterObj,getAllUniqueDonors,
    deleteInventroy,createInventroy,updateInventroy,
    setOrganizationIdToBody,getInventroiesAggregation}
    =require("../services/inventroyServices");

const {allowedTo,protect}=require('../services/authServices');



router.use(protect);

router.route('/').
    get(setFilterObj,getInventroies).
    post(allowedTo('admin','organization'),
        setOrganizationIdToBody,createInventroy);

router.route('/:id')
    .patch(allowedTo('admin','organization'),updateInventroy)
    .get(setFilterObj,getInventroy).
    delete(allowedTo('admin','organization'),deleteInventroy);

router.route('/donor').get(getAllUniqueDonors);
router.route('/hospital').get(getAllUniqueHospitals)
router.route('/organization-donor').get(getAllOrganizationsForDonors);
router.route('/organization-hospital').get(getAllOrganizationsForHospital);
router.route('/blood-group').get(getInventroiesAggregation);

module.exports = router;