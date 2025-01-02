const ExpressError = require('../utils/ExpressError'); // Adjust path if needed
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "polymer_property_prediction";




module.exports.signUp = async (req, res, next) => {
    try {
        // console.log(req.body);
 
        const { username, email, password } = req.body;
        //  console.log(username);
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ExpressError(400, "Email already in use"));
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });

        // Respond with user data and token
        res.status(201).json({
            message: "Signup successful",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
            token,
        });
    } catch (err) {
        return next(err);  // Pass the error to the error-handling middleware
    }
};



module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ExpressError(400, "Invalid email or password"));
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return next(new ExpressError(400, "Invalid email or password"));
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

        // Respond with user data and token
        res.status(200).json({
            success: true, 
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (err) {
        return next(err);  // Pass the error to the error-handling middleware
    }
};
