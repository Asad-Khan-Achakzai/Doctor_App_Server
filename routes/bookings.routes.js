const express = require("express");
const cors = require('cors');
const app = express();
const router = express.Router();
//let app = require('express')();
let http = require('http').Server(express);
const bookingController = require('../controllers/bookings.controllers');
const checkAuth = require('../middleware/check-auth');

// router.post("/registerBooking",bookingController.registerBooking);
router.post("/myAppointments",bookingController.getBooking);
router.post("/doctorAppointments",bookingController.getDoctorBooking);
router.post("/appointmentDiagnosed",bookingController.appointmentDiagnosed);
router.post("/appointments",bookingController.getAppontment);
router.post("/deleteAppontement",bookingController.deleteAppointment);
router.post("/apponintmentPayment",bookingController.newcustomer);

module.exports = router;    