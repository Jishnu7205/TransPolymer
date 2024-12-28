const ExpressError = require('../utils/ExpressError');
const Prediction = require('../models/prediction');
const fetch = require('node-fetch');

// Function to query the Hugging Face API
/*async function query(data) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/google-bert/bert-base-uncased", 
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`, // Use environment variable for API key
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        
        if (!response.ok) {
            throw new Error('Hugging Face API request failed');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        throw new Error(`Failed to query Hugging Face API: ${error.message}`);
    }
}*/

// Controller for handling the prediction
module.exports.predict = async (req, res, next) => {
    try {
        
        const userId = req.params.id;
        const { question } = req.body;  // Assuming userId and question are sent in the request body

        // Validate if userId and question are provided
        if (!userId || !question) {
            return next(new ExpressError(400, 'User ID and question are required.'));
        }

        // Query Hugging Face API to get the model's answer
        //const response = await query({ "inputs": question });
        const generatedAnswer ="This is a sample response";

        // Inspect response to find the model's answer
        // let generatedAnswer = "No answer generated";

        // Create a new Prediction document in the database
        const newPrediction = new Prediction({
            user: userId,  // Associating the prediction with the user
            question: question,
            answer: generatedAnswer,
        });

        // Save the prediction
        await newPrediction.save();

        // Respond with the generated answer and prediction data
        res.status(200).json({
            message: "Prediction successful",
            prediction: {
                user: userId,
                question: question,
                answer: generatedAnswer,
            },
        });
    } catch (err) {
        // Handle any errors
        return next(new ExpressError(500, err.message)); // Send error with status 500
    }
};

module.exports.getAllPredictions = async (req, res, next) => {
    try {
        const userId = req.params.id;  // Extract the userId from the URL params

        // Validate if userId is provided
        if (!userId) {
            return next(new ExpressError(400, 'User ID is required.'));
        }

        // Fetch all predictions associated with the user
        const predictions = await Prediction.find({ user: userId });  // Query the database using the userId

        // If no predictions are found for the user
        if (!predictions || predictions.length === 0) {
            return next(new ExpressError(404, 'No predictions found for this user.'));
        }

        // Respond with the list of predictions
        res.status(200).json({
            message: 'Predictions fetched successfully',
            predictions,
        });
    } catch (err) {
        // Handle any errors
        return next(new ExpressError(500, err.message));  // Send error with status 500
    }
};

