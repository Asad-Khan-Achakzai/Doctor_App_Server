const admins = require("../models/admin.model");
const Users = require("../models/users.model");
const bookings = require("../models/booking.model");
const serviceProvider = require("../models/serviceProviders.model");
var nodemailer = require("nodemailer");
var shortid = require("shortid");
const path = require("path");
const bcrypt = require("bcryptjs");
var shortid = require("shortid");
const mongoose = require("mongoose");
const adminsController = {};
const jsonwebtoken = require("jsonwebtoken");
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "asad.bsse3375@iiu.edu.pk",
    pass: "Pashtoon123",
  },
});
adminsController.registerAdmin = async (req, res) => {
  try {
    console.log("function called");
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
    const password = body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    body.password = hash;
    const user = new admins(body);
    //console.log('user = ',user);
    const result = await user.save();
    res.send({
      message: "Signup successful",
    });

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
adminsController.sendEmail = async (req, res) => {
  try {
    const result = await Users.findOne({ email: req.body.email });
    if (result) {
      // this means result is null
      res.send({
        message: "this email already exists as Customer",
      });
    }
    const serviceProviderresult = await serviceProvider.findOne({
      email: req.body.email.toLowerCase(),
    });
    if (serviceProviderresult) {
      // this means result is null
      res.send({
        message: "this email already exists as service provider",
      });
    }
    const adminsresult = await admins.findOne({ email: req.body.email });
    if (adminsresult) {
      // this means result is null
      res.send({
        message: "this email already exists as service provider",
      });
    }
    if (!result && !serviceProviderresult && !adminsresult) {
      let code = shortid.generate();
      var mailOptions = {
        from: "asad.bsse3375@iiu.edu.pk",
        to: req.body.email,
        subject: "verification code from Transport Service",
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
adminsController.sendPassword = async (req, res) => {
  try {
    const result = await Users.findOne({ email: req.body.email });
    if (result) {
      // this means result is null
      //   res.send({
      //     message: 'this email already exists as Customer',

      //    });
      let code = shortid.generate();
      var mailOptions = {
        from: "asad.bsse3375@iiu.edu.pk",
        to: req.body.email,
        subject: "verification code from Transport Service",
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
            user: 'customer',
            body:result
          });
        }
      });
    } else {
      const serviceProviderresult = await serviceProvider.findOne({
        email: req.body.email,
      });
      if (serviceProviderresult) {
        // this means result is null
        let code = shortid.generate();
        var mailOptions = {
          from: "asad.bsse3375@iiu.edu.pk",
          to: req.body.email,
          subject: "verification code from Transport Service",
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
              user: 'serviceProvider',
              body:serviceProviderresult

            });
          }
        });
      } else {
        const adminsresult = await admins.findOne({ email: req.body.email });
        if (adminsresult) {
          // this means result is null
          let code = shortid.generate();
          var mailOptions = {
            from: "asad.bsse3375@iiu.edu.pk",
            to: req.body.email,
            subject: "verification code from Transport Service",
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
                user: 'admin',
                body:adminsresult
              });
            }
          });
        } else {
          res.send({
            message: "this email does not exist",
          });
        }
      }
    }
    console.log("server body =", req.body);
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
// async function runUpdate(_id, updates, res) {
//   try {
//     const result = await Users.updateOne(
//       {
//         _id: _id,
//       },
//       {
//         $set: updates,
//       },
//       {
//         upsert: true,
//         runValidators: true,
//       }
//     );

//     {
//       if (result.nModified == 1) {
//         res.status(200).send({
//           code: 200,
//           message: "Updated Successfully",
//         });
//       } else if (result.upserted) {
//         res.status(200).send({
//           code: 200,
//           message: "Created Successfully",
//         });
//       } else {
//         res.status(422).send({
//           code: 422,
//           message: "Unprocessible Entity",
//         });
//       }
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// }
adminsController.changePassword = async (req, res) => {
  
  try {
    
    console.log('function called');
    const body = req.body;
   // console.log('req.body', body)
    //there must be a password in body

   // we follow these 2 steps
  //  const result = await cloudinary.v2.upl.upload(req.body.imageUrl)
  //  console.log('result = ',result.secure_url)
  console.log('server body =' ,body);
  // admins.find({ email: body.email }, async function (err, docs) {
  //   if (err) {
  //     //throw err;
  //     console.log('err = ',err);
  //   }
  //   else{
      
  //     console.log('docs = ',docs);
  //     const password =req.body.password;
  //     console.log('pass= ',password);
  //         var salt = bcrypt.genSaltSync(10);
  //         var hash = bcrypt.hashSync(password, salt);
      
  //         docs.password = hash;
  //     _id = docs._id;
  //     let obj = {_id:docs[0]._id,email:docs[0].email,password:hash,phone:docs[0].phone};
  //     let updates = obj;
  //     console.log('new body =',updates);
  //     runUserUpdate(_id, updates, res);
  //   }

  // });
  const password =req.body.password;
           var salt = bcrypt.genSaltSync(10);
          var hash = bcrypt.hashSync(password, salt);
      
          
  const filter = { email:req.body.email  };
  const update = { password: hash };
  
  // `doc` is the document _before_ `update` was applied
  let doc = await admins.findOneAndUpdate(filter, update);
  if(doc){
    res.status(200).send({
      code: 200,
      message: 'Updated Successfully'
    });
  }
  else{
    res.status(422).send({
      code: 422,
      message: 'could not update'
    });
    
  }

  } catch (ex) {
    console.log('ex', ex);
    if(ex.code===11000){  
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
async function runUserUpdate(_id, updates, res) {
  try {
    const result = await admins.updateOne(
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
      console.log('result = ',result);
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
adminsController.loginUser = async (req, res) => {
  try {
    console.log("login");
    const body = req.body;

    const email = body.email;

    // lets check if email exists

    const result = await admins.findOne({ email: email });
    if (!result) {
      // this means result is null
      res.status(401).send({
        message: "This user doesnot exists. Please signup first",
      });
    } else {
      // email did exist
      // so lets match password

      if (bcrypt.compareSync(body.password, result.password)) {
        // great, allow this user access
        result.password = undefined;
        const token = jsonwebtoken.sign(
          {
            data: result,
            role: "User",
          },
          process.env.JWT_KEY,
          { expiresIn: "7d" }
        );

        res.send({
          message: "Successfully Logged in",
          token: token,
          id: result._id,
        });
      } else {
        console.log("password doesnot match");

        res.status(401).send({ message: "Wrong email or Password" });
      }
    }
  } catch (ex) {
    console.log("ex", ex);
  }
};
adminsController.getAllCustomers = async (req, res) => {
  let users;
  console.log("in function of this");
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    users = await Users.paginate(
      merged,
      { password: 0 },
      {
        password: 0,
        offset: parseInt(start),
        limit: parseInt(length),
      }
    );
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: users,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
adminsController.getAllbookings = async (req, res) => {
  let users;
  console.log("in function of this");
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    users = await bookings.paginate(
      merged,
      { password: 0 },
      {
        password: 0,
        offset: parseInt(start),
        limit: parseInt(length),
      }
    );
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: users,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};
// adminsController.deleteCustomer = async (req, res) => {
//   if (!req.params._idd) {
//     Fu;
//     res.status(500).send({
//       message: "ID missing",
//     });
//   }
//   try {
//     const _id = req.params._idd;

//     const result = await bookings.findOneAndDelete({
//       id: _id,
//     });

//     res.status(200).send({
//       code: 200,
//       message: "Deleted Successfully",
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

module.exports = adminsController;
