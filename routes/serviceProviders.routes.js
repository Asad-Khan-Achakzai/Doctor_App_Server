const express = require("express");
const router = express.Router();

const UserController = require('../controllers/users.controllers');
const checkAuth = require('../middleware/check-auth');
const { route } = require("./users.routes");

// // router.get("/",UserController.sampleUser);
// router.get("/",UserController.getAll);
// router.post("/login",UserController.loginUser);

// router.get("/:_id",UserController.getSingleUser);
// // router.post("/",UserController.addUser);
// router.put("/:_id", UserController.updateUser);
// router.delete("/:_id", UserController.deleteUser);
router.post("/serviceProviderRegistration",UserController.registerServiceProvider);
router.post("/login",UserController.serviceProviderLogin);
router.get("/:_id",UserController.getServiceProvider);
router.post("/getAllServiceProviders",UserController.getAllServiceProviders);
router.get("/:id",UserController.getSingleServiceProviders);
router.post("/updateServiceProvider", UserController.updateServiceProvider);
router.put("/updateRanking", UserController.updateRanking);
router.put("/:id", UserController.editServiceProvider);
router.post("/:providerId", UserController.updateServiceProviderRoute);
router.delete("/:_id", UserController.deleteServiceProvider);
module.exports = router;
