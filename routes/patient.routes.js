const express = require("express");
// const cors = require('cors');
// const app = express();
const router = express.Router();
//let app = require('express')();
//let http = require('http').Server(express);
const patientController = require('../controllers/patients.contollers');
const checkAuth = require('../middleware/check-auth');
 




// router.get("/",UserController.sampleUser);
router.get("/login",patientController.loginPatient);
router.post("/register",patientController.registerPatient);
router.post("/sendMail",patientController.sendEmail);
router.post("/payment",patientController.payment);
router.post("/Login",patientController.Login);
router.post("/getPatient",patientController.getSinglePatient);
router.put("/:_id", patientController.updatePatient);

module.exports = router;