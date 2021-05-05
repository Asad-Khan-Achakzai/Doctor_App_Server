const bookingsController = {};
const bookings = require("../models/booking.model");
const serviceProvider = require('../models/serviceProviders.model');
const Doctors = require('../models/doctor.model');
const path = require("path");
const bcrypt = require("bcryptjs");
var shortid = require("shortid");
const mongoose = require('mongoose');
var nodemailer = require("nodemailer");
const stripe = require('stripe')('sk_test_51H4ItYBs0W61I6tPaV2hsFYP3RqsE2TCzCeqJ4l6qCTX9eeb7iMQFMSRdI1pToKoP0NHXK2nRhl8E7RxnNVqcCA200WWcRCqke');

var transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: "sayedobaidullahrahmani@gmail.com",
    pass: "Obaid@5991",
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false
  },
});
async function registerBooking(slotBody, res){
  let bookingId;

  try {
    console.log('body = >', slotBody)
    _id = slotBody.slotID;
    const body = {
      patientID:slotBody.patientID,
      patientName: slotBody.patientName,
      doctorName: slotBody.doctorName,
      doctorID: slotBody.doctorID,
      date: slotBody.date,
      time: slotBody.time,
      status: slotBody.status,
      slotID: slotBody.slotID
    }

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
      try {
        var mailOptions = {
          from: "asad.bsse3375@iiu.edu.pk",
          to: slotBody.patientEmail,
          subject: "Appointment",
          text: 'Your Appointment is sccussfull on ' + slotBody.date,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            res.send({
              message: "Failed",
              response: error,
            });
          } else {
            console.log("Email sent: " + info.response);
            res.send({
              message: 'Booking successful'
            });
            return
          }
        });

      } catch (error) {
        console.log('Error =', error)
      }
    }
    );

  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }

};
bookingsController.newcustomer = async (req, res) => {
  try {

    const body = req.body;
    const param = {};
    param.email = body.email;
    param.name = body.name;
    param.description = body.description;
    stripe.customers.create(param, function (err, customer) {
      if (err) {
        console.log("err: " + err);
      }
      if (customer) {
        console.log(JSON.stringify(customer));
        let idd = JSON.stringify(customer.id);
        let tokenBody = {
          number: body.number,
          exp_month: body.exp_month,
          exp_year: body.exp_year,
          cvc: body.cvc,
          amount:body.amount,
          currency:body.currency,
          description:body.description,
          id:customer.id,
          slotBody:body.slotBody
        }
        getToken(tokenBody, res);
        // res.status(200).send
        //   ({
        //     code: 200,
        //     message: idd
        //   });
      }
      else {
        console.log("Something wrong");
         res.status(400).send('Iusse in creating customer');
         return
      }
    })
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
async function getToken(body, res) {
  try {
    var param = {};
    param.card = {
      number: body.number,
      exp_month: body.exp_month,
      exp_year: body.exp_year,
      cvc: body.cvc
    }
    console.log('getToken', body);
    stripe.tokens.create(param, function (err, token) {
      if (err) {
        console.log(" getToken err: " + err);
      } if (token) {
        console.log("getToken success: " + JSON.stringify(token, null, 2));
        let paymenBody = {
          currency:body.currency,
          description:body.description,
          cid:body.id,
          tokid:token.id,
          amount:body.amount,
          slotBody:body.slotBody
        }
        pay(paymenBody, res);
        // res.status(200).send
        //   ({
        //     code: 200,

        //     message: token,
        //   });
      } else {
        console.log("Something wrong");
        res.status(400).send('Iusse in getting token');
         return
      }
    })
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
  async function pay(body, res) {
    try {
      const files = body;
      // const owner = req.params.owner;
      // const roomcode = new admins(files);
      // const result = await roomcode.save();
      console.log(files);
      console.log(files.cid);
      console.log(files.tokid);
      stripe.customers.createSource(files.cid, { source: files.tokid }, function (err, card) {
        if (err) {
          console.log(" createSource err: " + err);
        } if (card) {
          console.log("createSource success: " + JSON.stringify(card, null, 2));
        } else {
          console.log("Something wrong")
        }
      })
      const param = {};
      param.amount = files.amount,
        param.currency = files.currency,
         param.customer = files.cid
      stripe.charges.create(param, function (err, charge) {
        if (err) {
          console.log(" create err: " + err);
        } if (charge) {
          console.log("create success: " + JSON.stringify(charge, null, 2));
          registerBooking(files.slotBody, res);
          // res.status(200).send
          //   ({
          //     code: 200,
          //     message: "Succefull payment"
          //   });
        } else {
          console.log("Something wrong");
          res.status(400).send('Iusse in payment');
          return
        }
      })
    } catch (error) {
      console.log('error', error);
      return res.status(500).send(error);
    }
  };
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
        { date: req.body.date },
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
    user = await bookings.deleteOne({ _id: _id });
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
