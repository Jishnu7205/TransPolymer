const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError.js');
const User = require('./models/user.js');

// Middleware to parse JSON
app.use(express.json());

//requiring user routes
const userRouter = require('./routes/user.js');
//requiring prediction routes
const predictionRouter = require("./routes/prediction.js");

//DB Connection 
const MONGO_URL = "mongodb://127.0.0.1:27017/propertyPrediction";
async function dbconnection(){
    await mongoose.connect(MONGO_URL);
}
dbconnection()
    .then(() => {
        console.log("DB connected successfully");
    })
    .catch((err) =>{
        console.error(`Error connecting to DB : ${err}`);
    });



app.get("/", (req, res) => {
    res.send("Hi, i am root");
});



//user routes
app.use("/", userRouter);
//prediction routes
app.use("/prediction", predictionRouter);






app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});


//middleware
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "something went wrong"} = err;
    res.status(statusCode).json({ error: message });
    //console.log(err);
    // res.status(statusCode).send(message);
});


app.listen(8080, () => {
    console.log("Server is running on port 8080");
});