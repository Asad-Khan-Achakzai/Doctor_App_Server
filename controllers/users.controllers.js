const usersController = {};
const Users = require('../models/users.model');
const serviceProvider = require('../models/serviceProviders.model');
const path = require('path');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
var shortid = require('shortid');
const { use } = require('../routes/users.routes');
var cloudinary = require('cloudinary');
const { strict } = require('assert');
pass: String;
serviceProviderPass: String;
cloudinary.config({
  cloud_name: 'dlyi2iena',
  api_key: '335346455655612',
  api_secret: 'jRS_m5DJRXAXu0U7xjgUGwkp5OA'

});


//multer is already installed
usersController.getAll = async (req, res) => {
  let users;
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
        limit: parseInt(length)
      }
    );
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: users
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
usersController.getAllServiceProviders = async (req, res) => {
  let users;
  console.log('in function of this');
  try {
    let merged = {};
    const start = 0;
    const length = 100;
    users = await serviceProvider.paginate(
      merged,
      { password: 0 },
      {
        password: 0,
        offset: parseInt(start),
        limit: parseInt(length)
      }
    );
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: users
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

usersController.getSingleUser = async (req, res) => {
  let user;
  console.log('body of customer =', req.body);
  const body = req.body;
  // const email = body.email;
  //   console.log(email);
  // lets check if email exists

  //const result = await Users.findOne({ email: email });
  try {
    const _id = req.body.id;
    // user = await Users.findOne({ _id: _id });
    user = await Users.findOne({ _id: _id });
    user.password = this.pass;
    user.log
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: user,
      pass: this.pass
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
usersController.getUser = async (req, res) => {
  let user;
  // const body = req.body;
  // const email = body.email;
  //   console.log(email);
  // lets check if email exists

  //const result = await Users.findOne({ email: email });
  try {
    const _id = req.params.id;
    console.log('id of customer =', _id);
    // user = await Users.findOne({ _id: _id });
    user = await Users.findOne({ _id: _id });
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: user
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
usersController.getSingleServiceProviders = async (req, res) => {
  let user;
  // const body = req.body;
  // const email = body.email;
  //   console.log(email);
  // lets check if email exists

  //const result = await Users.findOne({ email: email });
  try {
    const _id = req.params.id;
    console.log('id of serviceProvider =', _id);
    // user = await Users.findOne({ _id: _id });
    user = await serviceProvider.findOne({ _id: _id });
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: user
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
usersController.getServiceProvider = async (req, res) => {
  console.log('id =', req.params._id);
  let user;
  const body = req.body;
  const email = body.email;
  // lets check if email exists

  //const result = await Users.findOne({ email: email });
  try {
    const _id = req.params._id;
    // user = await Users.findOne({ _id: _id });
    user = await serviceProvider.findOne({ _id: _id });
    res.status(200).send({
      code: 200,
      message: 'Successful',
      data: user,
      pass: this.serviceProviderPass
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};


usersController.registerUser = async (req, res) => {

  try {

    console.log('function called');
    const body = req.body;
    // console.log('req.body', body)
    //there must be a password in body

    // we follow these 2 steps
    //  const result = await cloudinary.v2.upl.upload(req.body.imageUrl)
    //  console.log('result = ',result.secure_url)
    console.log('server body =', body);
    Users.find({ email: body.email }, async function (err, docs) {
      if (err) {
        //throw err;
        console.log('err = ', err);
      }
      // console.log("data", docs);

      // Emit the messages
      body.shortID = shortid.generate();
      if (!docs.length) {
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
        const user = new Users(body);
        //console.log('user = ',user);
        const result = await user.save();
        res.send({
          message: 'Signup successful'
        });
      }
      else {
        res
          .send({
            message: 'This email has been registered already',
          })
          .status(500);
      }
      //socket.emit("customerInboxData", docs);
    });

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
usersController.registerServiceProvider = async (req, res) => {

  try {
    const body = req.body;

    // there must be a password in body

    // we follow these 2 steps
    //console.log("server body = "+body);
    serviceProvider.find({ email: body.email }, async function (err, docs) {
      if (err) {
        //throw err;
        console.log('err = ', err);
      }
      // console.log("data", docs);

      // Emit the messages
      if (!docs.length) {
        body.shortID = shortid.generate();

        await cloudinary.v2.uploader.upload(req.body.imageUrl, { public_id: body.shortID }, function (error, result) {
          // console.log('result =',result);
          body.imageUrl = result.secure_url;
          console.log(result.secure_url);

        });
        const password = body.password;

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(password, salt);

        body.password = hash;
        for (let i = 0; i < body.servicesArray.length; i++) {
          body.servicesArray[i].id = shortid.generate();
          body.servicesArray[i].bookedSeats = [];
          body.servicesArray[i].paused = false;
        }
        body.voters = 1;
        body.rank = 5.0;
        const user = new serviceProvider(body);
        console.log("server body = " + user);
        const result = await user.save();
        console.log('saved = ', user);
        res.send({
          message: 'Signup successful'
        });
      }
      else {
        res
          .send({
            message: 'This email has been registered already',
          })
          .status(500);
      }
    });
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

usersController.serviceProviderLogin = async (req, res) => {
  try {
    const body = req.body;

    const email = body.email;

    // lets check if email exists

    const result = await serviceProvider.findOne({ email: email });
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
usersController.loginUser = async (req, res) => {
  try {
    console.log('login');
    const body = req.body;

    const email = body.email;

    // lets check if email exists

    const result = await Users.findOne({ email: email });
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
        this.pass = body.password;
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

usersController.getNextId = async (req, res) => {
  try {
    const max_result = await Users.aggregate([
      { $group: { _id: null, max: { $max: '$id' } } }
    ]);

    let nextId;
    if (max_result.length > 0) {
      nextId = max_result[0].max + 1;
    } else {
      nextId = 1;
    }

    var data = {
      code: 200,
      data: { id: nextId }
    };
    res.status(200).send(data);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

usersController.deleteUser = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.params._id;

    const result = await Users.findOneAndDelete({
      _id: _id
    });
    //   const result = await Inventory.updateOne({
    //         _id: _id
    //     }, {
    //         $set: {is_deleted: 1}
    //     }, {
    //         upsert: true,
    //         runValidators: true
    //     });
    res.status(200).send({
      code: 200,
      message: 'Deleted Successfully'
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
usersController.deleteServiceProvider = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.params._id;

    const result = await serviceProvider.findOneAndDelete({
      _id: _id
    });
    //   const result = await Inventory.updateOne({
    //         _id: _id
    //     }, {
    //         $set: {is_deleted: 1}
    //     }, {
    //         upsert: true,
    //         runValidators: true
    //     });
    res.status(200).send({
      code: 200,
      message: 'Deleted Successfully'
    });
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
usersController.uploadAvatar = async (req, res) => {
  try {
    const filePath = `images/avatar/avatar-${req.params.id}`;
    const ext = path.extname(req.file.originalname);
    const updates = {
      avatar: filePath,
      avatar_ext: ext
    };
    runUpdateById(req.params.id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
usersController.updateUser = async (req, res) => {
  console.log('id =', req.params.logedInCustomerId);
  console.log('body =', req.body);
  if (!req.params.logedInCustomerId) {
    res.status(500).send({
      message: 'ID missing'
    });
  }
  let img = req.body.imageUrl;
  console.log('img =', img);

  if (new RegExp("[a-zA-Z\d]+://(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(/.*)?").test(img)) {
    console.log('httpimg =', img);
  }
  else {
    console.log('not =', img);
    await cloudinary.v2.uploader.destroy(req.body.shortID, function (error, result) {
      console.log('destroy result =', result);
    });
    await cloudinary.v2.uploader.upload(req.body.imageUrl, { public_id: req.body.shortID }, function (error, result) {
      console.log('upload result =', result);
      req.body.imageUrl = result.secure_url;
      console.log('dataimg =', img);
    });
  }
  try {
    const password = req.body.password;
    console.log('pass= ', password);
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);

    req.body.password = hash;
    const _id = req.params.logedInCustomerId;
    let updates = req.body;
    console.log('updats', updates);
    runUserUpdate(_id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

async function runUserUpdate(_id, updates, res) {
  try {
    const result = await Users.updateOne(
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
usersController.editServiceProvider = async (req, res) => {
  console.log('id =', req.params.id);
  console.log('body =', req.body);
  if (!req.params.id) {
    res.status(500).send({
      message: 'ID missing'
    });
  }
  let img = req.body.imageUrl;
  //console.log('img =',img);
  if (new RegExp("[a-zA-Z\d]+://(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(/.*)?").test(img)) {
    console.log('httpimg =', img);
  }
  else {
    await cloudinary.v2.uploader.destroy(req.body.shortID, function (error, result) {
      console.log('result =', result);
    });
    await cloudinary.v2.uploader.upload(req.body.imageUrl, { public_id: req.body.shortID }, function (error, result) {
      console.log('result =', result);
      req.body.imageUrl = result.secure_url;
      console.log('dataimg =', img);
    });
  }
  try {
    const password = req.body.password;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    for (let i = 0; i < req.body.servicesArray.length; i++) {
      if (!req.body.servicesArray[i].id) {
        req.body.servicesArray[i].id = shortid.generate();
        req.body.servicesArray[i].bookedSeats = [];
        console.log('new arr ', req.body.servicesArray[i])
      }

    }


    req.body.password = hash;
    const _id = req.params.id;
    let updates = req.body;
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};


async function runUpdate(_id, updates, res) {
  try {
    const result = await serviceProvider.updateOne(
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
usersController.updateServiceProvider = async (req, res) => {
  console.log('req = ', req.body)
  if (!req.body.id) {
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.body.id;
    console.log('id = ', _id)
    const result = serviceProvider.updateOne(
      { "servicesArray.id": _id },
      {
        $push: { 'servicesArray.$.bookedSeats': { $each: req.body.bookedSeats } }
      }, function (err, success) {
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
          {
            res.status(200).send({
              code: 200,
              message: 'Task completed successfully'
            });
          }
        }
        if (err) {
          console.log('error = ', err);
        }
        else
          console.log('success = ', success);
      }

    );
    // let updates = req.body;
    //runUpdateOnServiceProvider(_id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};
usersController.updateRanking = async (req, res) => {
  console.log('ranking body = ', req.body);
  let voters;
  let oldRanking;
  let newRank;
  let body = req.body;
  try {
    await serviceProvider.find({ _id: body.id }, async function (err, docs) {
      console.log('obj = ', docs);
      voters = docs[0].voters;
      oldRanking = docs[0].rank;

      let mul = oldRanking * voters;
      console.log('mul = ', mul);
      let plus = mul + body.ranking;
      console.log('plus = ', plus);
      let voterPlus = voters + 1
      console.log('voterPlus = ', voterPlus);
      let div = plus / voterPlus;
      console.log('div = ', div);
      newRank = div;
      // newRank = ((oldRanking * voters)+ body.ranking)/voters+1;

      console.log('new ranking = ', newRank);
      const filter = { _id: body.id };
      const update = { rank: newRank, voters: voterPlus };

      // `doc` is the document _before_ `update` was applied
      let doc = await serviceProvider.findOneAndUpdate(filter, update);
      console.log('update funciton called');
      if (doc) {
        res.status(200).send({
          code: 200,
          message: 'Task completed successfully'
        });
      }
    });

    // const filter = { _id: body.id };
    // const update = { rank: newRank };

    // // `doc` is the document _before_ `update` was applied
    // let doc = await serviceProvider.findOneAndUpdate(filter, update);
    // if (doc) {
    //   res.status(200).send({
    //     code: 200,
    //     message: 'Task completed successfully'
    //   });
    // }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
  //  if (!req.body.id) {
  //    res.status(500).send({
  //      message: 'ID missing'
  //    });
  //  }
  //   try {
  //    const _id = req.body.id;
  //    console.log('id = ',_id)
  //    const result =  serviceProvider.updateOne(
  //      { "servicesArray.id": _id },
  //      { $push: { 'servicesArray.$.bookedSeats': {$each:req.body.bookedSeats}}
  //     },function(err,success){
  //        if (result.nModified == 1) {
  //          res.status(200).send({
  //            code: 200,
  //            message: 'Updated Successfully'
  //          });
  //        } else if (result.upserted) {
  //          res.status(200).send({
  //            code: 200,
  //            message: 'Created Successfully'
  //          });
  //        } else {
  //          {
  //            res.status(200).send({
  //              code: 200,
  //              message: 'Task completed successfully'
  //            });
  //          }
  //        }
  //        if(err){
  //        console.log('error = ',err);
  //      }
  //      else
  //      console.log('success = ',success);
  //      }

  //  );
  //   // let updates = req.body;
  //    //runUpdateOnServiceProvider(_id, updates, res);
  //  } catch (error) {
  //    console.log('error', error);
  //    return res.status(500).send(error);
  //  }
};
usersController.updateServiceProviderRoute = async (req, res) => {
  console.log('idsss =', req.params.providerId);
  console.log('req = ', req.body)
  if (!req.params.providerId) {
    res.status(500).send({
      message: 'ID missing'
    });
  }
  try {
    const _id = req.body.routId;
    console.log('id = ', _id)
    const result = serviceProvider.updateOne(
      { "servicesArray.id": _id },

      {
        $pullAll: { 'servicesArray.$.bookedSeats': req.body.seats }
        //  { $push: { 'servicesArray.$.bookedSeats': {$each:req.body.bookedSeats}}
      }, function (err, success) {
        if (result.nModified === 1) {
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
          {
            res.status(200).send({
              code: 200,
              message: 'Task completed successfully'
            });
          }
        }
        if (err) {
          console.log('error = ', err);
        }
        else
          console.log('success = ', success);
      }

    );
    // let updates = req.body;
    //runUpdateOnServiceProvider(_id, updates, res);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
};

// async function runUpdateOnServiceProvider(_id, updates, res) {
//   try {
//     const result = await serviceProvider.updateOne(
//       {
//         _id: _id
//       },
//       {
//         $set: updates
//       },
//       {
//         upsert: true,
//         runValidators: true
//       }
//     );

//     {
//       if (result.nModified == 1) {
//         res.status(200).send({
//           code: 200,
//           message: 'Updated Successfully'
//         });
//       } else if (result.upserted) {
//         res.status(200).send({
//           code: 200,
//           message: 'Created Successfully'
//         });
//       } else {
//         res.status(422).send({
//           code: 422,
//           message: 'Unprocessible Entity'
//         });
//       }
//     }
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// }
// usersController.updateUser = async (req, res) => {
//   if (!req.params._id) {
//     res.status(500).send({
//       message: 'ID missing'
//     });
//   }
//   try {
//     const _id = req.params._id;
//     let updates = req.body;
//     runUpdate(_id, updates, res);
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// };

// async function runUpdate(_id, updates, res) {
//   try {
//     const result = await Users.updateOne(
//       {
//         _id: _id
//       },
//       {
//         $set: updates
//       },
//       {
//         upsert: true,
//         runValidators: true
//       }
//     );

//     {
//       if (result.nModified == 1) {
//         res.status(200).send({
//           code: 200,
//           message: 'Updated Successfully'
//         });
//       } else if (result.upserted) {
//         res.status(200).send({
//           code: 200,
//           message: 'Created Successfully'
//         });
//       } else {
//         res.status(422).send({
//           code: 422,
//           message: 'Unprocessible Entity'
//         });
//       }
//     }
//   } catch (error) {
//     console.log('error', error);
//     return res.status(500).send(error);
//   }
// }
async function runUpdateById(id, updates, res) {
  try {
    const result = await Users.updateOne(
      {
        id: id
      },
      {
        $set: updates
      },
      {
        upsert: true,
        runValidators: true
      }
    );

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
      {
        res.status(200).send({
          code: 200,
          message: 'Task completed successfully'
        });
      }
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send(error);
  }
}

module.exports = usersController;
