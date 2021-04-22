const express = require("express");
const cors = require('cors');
const app = express();
const router = express.Router();
let http = require('http').Server(express);
const adminController = require('../controllers/admins.contollers');


router.post("/registerAdmin",adminController.registerAdmin);
router.post("/login",adminController.loginUser);
router.post("/getAllCustomers",adminController.getAllCustomers);
router.post("/getAllbookings",adminController.getAllbookings);
router.post("/sendEmail",adminController.sendEmail);
router.post("/sendPassword",adminController.sendPassword);
router.post("/changePassword",adminController.changePassword);

// router.delete("/:_idd", adminController.deleteCustomer);
module.exports = router;