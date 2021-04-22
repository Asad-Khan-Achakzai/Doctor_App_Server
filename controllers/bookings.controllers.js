const bookingsController = {};
const bookings = require("../models/booking.model");
const serviceProvider = require('../models/serviceProviders.model');
const Doctors = require('../models/doctor.model');
const path = require("path");
const bcrypt = require("bcryptjs");
var shortid = require("shortid");
const mongoose = require('mongoose');

bookingsController.registerBooking = async (req, res) => {
  let bookingId;

  try {
    console.log('body = >', req.body)
    _id = req.body.slotID;
    const body = req.body;

    const user = new bookings(body);
    //console.log('user = ',user);
    const result = await user.save();
    Doctors.updateOne({ 'timing.slots.slotId': _id }, {
      '$set': {
        'timing.slots.$.status': 'appointed'
      }
    }, function (err, result) {
      if (err) throw err;
      console.log('result = ', result);

    }
      // Doctors.updateOne({ slotId: _id }, { status: "appointed" }, function (
      //   err,
      //   result
      // ) {
      //   if (err) throw err;
      //   console.log('result = ', result);

      //}
    );
    res.send({
      message: 'Booking successful'
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }

};
bookingsController.getBooking = async (req, res) => {

  try {
    console.log('  req.body = ', req.body);

    const _id = req.body.id;
    console.log(' id = ', _id);
    // user = await Users.findOne({ _id: _id });
    user = await bookings.find({ patientID: _id });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
bookingsController.getDoctorBooking = async (req, res) => {
  try {
    console.log('  req.body = ', req.body);

    const _id = req.body.id;
    console.log(' id = ', _id);
    // user = await Users.findOne({ _id: _id });
    user = await bookings.find({ doctorID: _id });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
bookingsController.getBookingObject = async (req, res) => {
  let user;
  console.log("id =", req.params._id);
  // const body = req.body;
  // const email = body.email;
  // lets check if email exists

  //const result = await Users.findOne({ email: email });

  try {
    const _id = req.params._id;
    //console.log('customer id = ',_id);
    // user = await Users.findOne({ _id: _id });
    user = await bookings.find({ id: _id });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
bookingsController.getAppontment = async (req, res) => {
  let user;
  console.log("id =", req.params._id);
  // const body = req.body;
  // const email = body.email;
  // lets check if email exists

  //const result = await Users.findOne({ email: email });

  try {
    const _id = req.params._id;
    //console.log('customer id = ',_id);
    // user = await Users.findOne({ _id: _id });
    user = await bookings.find({
      $and: [
        { date:req.body.date },
        { doctorID: req.body.doctorID }
      ]
    });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
bookingsController.deleteAppointment = async (req, res) => {
  let user;
  // const body = req.body;
  // const email = body.email;
  // lets check if email exists

  //const result = await Users.findOne({ email: email });

  try {
    const _id = req.body._id;
    //console.log('customer id = ',_id);
    // user = await Users.findOne({ _id: _id });
    user = await bookings.deleteOne({_id:_id });
    res.status(200).send({
      code: 200,
      message: "Deleted Successfuly",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
bookingsController.appointmentDiagnosed = async (req, res) => {
  let user;
  console.log("id =", req.body.id);
  // const body = req.body;
  // const email = body.email;
  // lets check if email exists

  //const result = await Users.findOne({ email: email });

  try {
    const _id = req.body.id;
    //console.log('customer id = ',_id);
    // user = await Users.findOne({ _id: _id });
    bookings.updateOne({ _id: _id }, { status: "diagnosed" }, function (
      err,
      result
    ) {
      if (err) throw err;
      console.log('result = ', result);

    }
    );
    res.status(200).send({
      code: 200,
      message: "update Successful",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
bookingsController.getRouteBookings = async (req, res) => {
  let user;
  // const body = req.body;
  // const email = body.email;
  // lets check if email exists

  //const result = await Users.findOne({ email: email });

  try {
    const _id = req.params.id;
    console.log(" id = ", _id);
    // user = await Users.findOne({ _id: _id });
    user = await bookings.find({ routId: _id });
    console.log("data = ", user);
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: user,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

module.exports = bookingsController;
