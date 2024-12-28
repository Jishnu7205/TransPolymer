const express = require('express');
const router = express.Router();

const wrapAsync = require('../utils/wrapAsync');
const userController = require('../controllers/user.js');


//user signup (register)
router.route("/signup")
    .post(wrapAsync(userController.signUp));

//user login
router.route("/login")
    .post(userController.login);

    
module.exports = router;