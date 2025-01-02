const express = require('express');
const router = express.Router();
const authMiddleware = require('../authMiddleware');

const predictionController = require('../controllers/prediction');

// Temporarily remove authentication for testing purposes
router.route("/:id")
    .get(authMiddleware, predictionController.getAllPredictions)  // Protected GET route
    .post(authMiddleware, predictionController.predict);          // Protected POST route

module.exports = router;
