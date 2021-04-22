const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
require('dotenv').config();
const errorHandler = require("./middleware/error-handler");
const errorMessage = require("./middleware/error-message");
const accessControls = require("./middleware/access-controls");
const mongoose = require('mongoose');
const cors = require('cors');

//const bodyParser = require('body-parser')
const bodyParser = require("body-parser");
app.use(bodyParser.json({limit: '10mb', type: 'application/json'}));

app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  
  app.use(bodyParser.json()); // to support JSON-encoded bodies



  // app.use(cors());
   
  // app.options("*", cors());

// // HANDLING CORS ERRORS
// app.use((req, res, next) =>{
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', '*');
//   if(req.method === 'OPTIONS'){
//   res.headers('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE');
//   return res.status(200).json({})
//   }
//    next();
//   });
//   //HANDLE ERROR
//   app.use((req, res, next) => {
//   const error = new Error('NOT FOUND')
//   error.status = 404
//   next(error)
//   })
//   app.use((error, req, res, next) => {
//   res.status(error.status || 500)
//   res.json({
//   error: {
//   message: error.message
//   }
//   })
//   })




// Requiring Routes

// const UsersRoutes = require('./routes/users.routes');
// const BooksRoutes = require('./routes/books.routes');
// const serviceProviderRoutes = require('./routes/serviceProviders.routes');
// const bookingRoutes = require('./routes/bookings.routes');
const UsersRoutes = require("./routes/users.routes");
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");
const BooksRoutes = require("./routes/books.routes");
const serviceProviderRoutes = require("./routes/serviceProviders.routes");
const bookingRoutes = require("./routes/bookings.routes");
const adminRoutes = require("./routes/admin.routes");

// connection to mongoose
const mongoCon = process.env.mongoCon;

mongoose.connect(mongoCon,{ useNewUrlParser: true,useCreateIndex: true, useUnifiedTopology: true });

mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ');
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function (error) {  
  console.log('Mongoose default connection disconnected',error); 
});
const fs = require('fs');
fs.readdirSync(__dirname + "/models").forEach(function(file) {
    require(__dirname + "/models/" + file);
});

// in case you want to serve images 
app.use(express.static("public"));

app.get('/',  function (req, res) {
  res.status(200).send({
    message: 'Express backend server'});
});

//app.set('port', (3000));
app.set( 'port',(process.env.PORT));

// app.use(accessControls);
 app.use(cors());

// Routes which should handle requests
app.use("/users",UsersRoutes);
app.use("/patients",patientRoutes);
app.use("/doctors",doctorRoutes);
app.use("/books",BooksRoutes);
app.use("/providers",serviceProviderRoutes);
app.use("/bookings",bookingRoutes);
app.use("/admins",adminRoutes);

app.use(errorHandler);

app.use(errorMessage);

server.listen(app.get('port'));
console.log('listening on port',app.get('port'));
