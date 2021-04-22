const patientContoller = {};
const Doctors = require('../models/doctor.model');
const Patients = require('../models/patients.model');
const path = require('path');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
var shortid = require('shortid');
const { use } = require('../routes/users.routes');
const { strict } = require('assert');
var nodemailer = require("nodemailer");
var cloudinary = require('cloudinary');
const stripe = require('stripe')('sk_test_51H4ItYBs0W61I6tPaV2hsFYP3RqsE2TCzCeqJ4l6qCTX9eeb7iMQFMSRdI1pToKoP0NHXK2nRhl8E7RxnNVqcCA200WWcRCqke');
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "asad.bsse3375@iiu.edu.pk",
    pass: "Pashtoon123",
  },
});
cloudinary.config({
  cloud_name: 'dlyi2iena',
  api_key: '335346455655612',
  api_secret: 'jRS_m5DJRXAXu0U7xjgUGwkp5OA'

});
// patientContoller.payment = async (req, res) => {
//   try {
//     console.log('login');

//   } catch (ex) {
//     console.log('ex', ex);
//   }
// };
patientContoller.loginPatient = async (req, res) => {
  try {
    console.log('login');
    //   const body = req.body;

    //   const email = body.email;

    //   // lets check if email exists

    //   const result = await Users.findOne({ email: email });
    //   if (!result) {
    //     // this means result is null
    //     res.status(401).send({
    //       message: 'This user doesnot exists. Please signup first'
    //     });
    //   } else {
    //     // email did exist
    //     // so lets match password

    //     if (bcrypt.compareSync(body.password, result.password)) {
    //       // great, allow this user access
    //       this.pass = body.password;
    //       result.password = undefined;
    //       const token = jsonwebtoken.sign({
    //         data: result,
    //         role: 'User'
    //       }, process.env.JWT_KEY, { expiresIn: '7d' });

    //       res.send({ message: 'Successfully Logged in', token: token, id: result._id });
    //     }

    //     else {
    //       console.log('password doesnot match');

    //       res.status(401).send({ message: 'Wrong email or Password' });
    //     }
    //   }
  } catch (ex) {
    console.log('ex', ex);
  }
};
patientContoller.registerPatient = async (req, res) => {
  console.log('function called');
  const body = req.body;
  console.log('req.body', body)
  try {
    console.log('function called');
    const body = req.body;
    console.log('req.body', body)
    //there must be a password in body

    // we follow these 2 steps
    //  const result = await cloudinary.v2.upl.upload(req.body.imageUrl)
    //  console.log('result = ',result.secure_url)
    console.log('server body =', body);

    // console.log("data", docs);

    // Emit the messages
    body.shortID = shortid.generate();
    await cloudinary.v2.uploader.upload(body.imageUrl, { public_id: body.shortID }, function (error, result) {
      console.log('result =', result);
      if (!result) {
        res
          .send({
            message: 'image is not saved',
          })
          .status(500);
      }
      body.imageUrl = result.secure_url;
      console.log(result.secure_url);

    });
    //body.imageUrl = url;
    const password = body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    body.password = hash;
    const user = new Patients(body);
    //console.log('user = ',user);
    const result = await user.save();
    res.send({
      message: 'Signup successful'
    });

    //socket.emit("customerInboxData", docs);


  } catch (ex) {
    console.log('ex', ex);
    if (ex.code === 11000) {
      res
        .send({
          message: 'This email has been registered already',
        })
        .status(500);
    }
    else {
      res
        .send({
          message: 'Error',
          detail: ex
        })
        .status(500);
    }
  }
};
patientContoller.sendEmail = async (req, res) => {
  console.log('email', req.body);
  try {
    const Doctor = await Doctors.findOne({
      email: req.body.email.toLowerCase(),
    });
    const result = await Patients.findOne({ email: req.body.email });
    console.log('result', result);

    if (Doctor) {
      // this means result is null
      res.send({
        message: "this email already exists as Doctorsr",
      });
      return;
    }
    else if (result) {
      // this means result is null
      res.send({
        message: "this email already exists as pateint",
      });
      return;
    }
    // const serviceProviderresult = await serviceProvider.findOne({
    //   email: req.body.email.toLowerCase(),
    // });
    // if (serviceProviderresult) {
    //   // this means result is null
    //   res.send({
    //     message: "this email already exists as service provider",
    //   });
    // }
    else {
      let code = shortid.generate();
      var mailOptions = {
        from: "asad.bsse3375@iiu.edu.pk",
        to: req.body.email,
        subject: "verification code from DoctorApp",
        text: code,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.send({
            message: "Failed",
            response: error,
          });
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.send({
            message: "Email sent successfuly",
            response: info.response,
            code: code,
          });
        }
      });
    }
    console.log("function called", req.body);
    const body = req.body;
    // console.log('req.body', body)
    //there must be a password in body

    // we follow these 2 steps
    //  const result = await cloudinary.v2.upl.upload(req.body.imageUrl)
    //  console.log('result = ',result.secure_url)
    console.log("server body =", body);
    // Users.find({ email: body.email }, async function (err, docs) {
    //   if (err) {
    //     //throw err;
    //     console.log('err = ',err);
    //   }
    // console.log("data", docs);

    // Emit the messages
    //   body.shortID = shortid.generate();
    //   if(!docs.length){
    //        await cloudinary.v2.uploader.upload(body.imageUrl,{ public_id: body.shortID }, function(error, result) {
    //   console.log('result =',result);
    //   body.imageUrl =  result.secure_url;
    //   console.log(result.secure_url);

    // });
    //body.imageUrl = url;
    //      const password = body.password;

    //      var salt = bcrypt.genSaltSync(10);
    //      var hash = bcrypt.hashSync(password, salt);

    //      body.password = hash;
    //      const user = new admins(body);
    // //console.log('user = ',user);
    //     const result = await user.save();
    //      res.send({
    //       message: 'Signup successful'
    //      });

    //socket.emit("customerInboxData", docs);
  } catch (ex) {
    console.log("ex", ex);
    if (ex.code === 11000) {
      res
        .send({
          message: "This email has been registered already",
        })
        .status(500);
    } else {
      res
        .send({
          message: "Error",
          detail: ex,
        })
        .status(500);
    }
  }
};
patientContoller.payment = async (req, res) => {
  console.log('payment body', req.body);
  try {
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken,
      name: 'Gourav Hammad',
      address: {
        line1: 'TC 9/4 Old MES colony',
        postal_code: '452331',
        city: 'Indore',
        state: 'Madhya Pradesh',
        country: 'India',
      }
    })
      .then((customer) => {

        return stripe.charges.create({
          amount: 2500,     // Charing Rs 25 
          description: 'Web Development Product',
          currency: 'INR',
          customer: customer.id
        });
      })
      .then((charge) => {
        res.send("Success")  // If no error occurs 
      })
      .catch((err) => {
        res.send(err)       // If some error occurs 
      });

  } catch (ex) {
    console.log("ex", ex);
    res
      .send({
        message: "Error",
        detail: ex,
      })
      .status(500);
  }
};
patientContoller.Login = async (req, res) => {
  try {
    console.log('body', req.body);
    const body = req.body;

    const email = body.email;

    // lets check if email exists

    const result = await Patients.findOne({ email: email });
    if (!result) {
      // this means result is null
      res.status(401).send({
        message: 'This user doesnot exists. Please signup first'
      });
    } else {
      // email did exist
      // so lets match password


      if (bcrypt.compareSync(body.password, result.password)) {
        // great, allow this user access
        this.serviceProviderPass = body.password;
        result.password = undefined;

        const token = jsonwebtoken.sign({
          data: result,
          role: 'User'
        }, process.env.JWT_KEY, { expiresIn: '7d' });

        res.send({ message: 'Successfully Logged in', token: token, id: result._id });
      }

      else {
        console.log('password doesnot match');

        res.status(401).send({ message: 'Wrong email or Password' });
      }
    }
  } catch (ex) {
    console.log('ex', ex);
  }
};
patientContoller.getSinglePatient = async (req, res) => {
  let user;
  console.log('body of doctor =', req.body);
  const body = req.body;
  // const email = body.email;
  //   console.log(email);
  // lets check if email exists

  //const result = await Users.findOne({ email: email });
  try {
    const _id = req.body.id;
    // user = await Users.findOne({ _id: _id });
    user = await Patients.findOne({ _id: _id });
    // user.password = this.pass;
    // user.log
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: user,
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
patientContoller.updatePatient = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: 'ID missing'
    });
  }
  let img = req.body.imageUrl;

  if (new RegExp("[a-zA-Z\d]+://(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(/.*)?").test(img)) {
    console.log('httpimg =');
  }
  else {
    console.log('not =');
    await cloudinary.v2.uploader.destroy(req.body.shortID, function (error, result) {
      console.log(' destroy result =', result);
    });
    await cloudinary.v2.uploader.upload(req.body.imageUrl, { public_id: req.body.shortID }, function (error, result) {
      console.log('upload result =', result);
      req.body.imageUrl = result.secure_url;
    });
  }
  try {
    if (req.body.password) {
      const password = req.body.password;
      console.log('pass= ', password);
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      req.body.password = hash;
    } else {
      delete req.body.password;
    }
    const _id = req.params._id;
    console.log('id',_id);
    let updates = req.body;
    runUserUpdate(_id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

async function runUserUpdate(_id, updates, res) {
  try {
    const result = await Patients.update(
      {
        _id: _id
      },
      {
        $set: updates
      },
      {
        upsert: true,
        runValidators: true
      }
    );

    {
      console.log('result = ', result);
      if (result.nModified == 1) {
        res.status(200).send({
          code: 200,
          message: 'Updated Successfully'
        });
      } else if (result.upserted) {
        res.status(200).send({
          code: 200,
          message: 'Created Successfully'
        });
      } else {
        res.status(422).send({
          code: 422,
          message: 'Unprocessible Entity'
        });
      }
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
}

module.exports = patientContoller;
