const express = require("express");
// const cors = require('cors');
// const app = express();
const router = express.Router();
//let app = require('express')();
//let http = require('http').Server(express);
const UserController = require('../controllers/users.controllers');
const checkAuth = require('../middleware/check-auth');
 




// router.get("/",UserController.sampleUser);
router.get("/",UserController.getAll);
router.post("/login",UserController.loginUser);
router.post("/register",UserController.registerUser);
//router.get("/:_id",UserController.getSingleUser);
// router.post("/",UserController.addUser);
router.post("/getCustomer",UserController.getSingleUser);
router.put("/:logedInCustomerId", UserController.updateUser);
router.delete("/:_id", UserController.deleteUser);
router.get("/:id", UserController.getUser);
module.exports = router;