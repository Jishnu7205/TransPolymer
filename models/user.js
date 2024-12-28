const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        // Simple regex for email validation
        return /^\S+@\S+\.\S+$/.test(value);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum length for security
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
