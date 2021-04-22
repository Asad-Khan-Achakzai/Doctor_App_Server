const express = require("express");
// const cors = require('cors');
// const app = express();
const router = express.Router();
//let app = require('express')();
//let http = require('http').Server(express);
const doctorController = require('../controllers/doctor.contollers');
const checkAuth = require('../middleware/check-auth');
 



router.post("/register",doctorController.registerDoctor);
router.post("/sendMail",doctorController.sendEmail);
router.post("/getAllDoctors",doctorController.getAllDoctors);
router.post("/Login",doctorController.Login);
router.post("/getDoctor",doctorController.getSingDoctor);
router.put("/:_id", doctorController.updateDoctor);

module.exports = router;