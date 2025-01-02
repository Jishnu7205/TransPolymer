const ExpressError = require('../utils/ExpressError');
const Prediction = require('../models/prediction');
const axios = require('axios');

// Controller for handling the prediction
module.exports.predict = async (req, res, next) => {
    try {
        
        const { userId, question } = req.body; // Get both userId and question from the request body

        // Validate if userId and question are provided
        if (!userId || !question) {
            return next(new ExpressError(400, 'User ID and question are required.'));
        }


        // Send the input to the Kaggle notebook
        // const response = await axios.post("https://2853-34-151-69-137.ngrok-free.app/predict", { text: question });

        // Get the prediction from the Kaggle notebook's response
        // const prediction = response.data.prediction;
        // console.log(response.data);
        const prediction ="This is the sample prediction";

        let generatedAnswer;
        if(prediction){
            generatedAnswer = `The Estimated PDI(Polymer Density Index) -> ${prediction}`;
        }
        else{
            generatedAnswer = "Sorry, I am unable to generate an answer for this question.";
        }
        // Query Hugging Face API to get the model's answer
        //const response = await query({ "inputs": question });
        // const generatedAnswer ="This is a sample response";

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
        const { userId } = req.query;  // Extract userId from query parameters

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

