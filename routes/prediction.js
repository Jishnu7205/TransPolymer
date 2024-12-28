const express = require('express');
const router = express.Router();

const authenticateToken = require('../authMiddleware');  
const predictionController = require('../controllers/prediction');

// Add the authentication middleware to protect the routes
router.route("/:id")
    .get(authenticateToken, predictionController.getAllPredictions)  // Protect the GET route
    .post(authenticateToken, predictionController.predict);  // Protect the POST route

module.exports = router;
